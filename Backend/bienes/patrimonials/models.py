from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

# Create your models here.
from django.contrib.auth.models import AbstractUser 
from django.core.validators import MinValueValidator 
from django.db.models.signals import post_save 
from django.dispatch import receiver 
from datetime import date, timedelta
import qrcode 
from io import BytesIO
from django.core.files import File 

class UsuarioManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError('El username debe ser obligatorio')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password) 
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)

class Usuario(AbstractUser):
    ROLES = (
        ('ADMIN', 'Administrador'),
        ('GESTOR', 'Gestor de bienes'),
        ('AUDITOR', 'Auditor'),
        ('CONSULTA', 'Consulta'),
    )
    
    rol = models.CharField(max_length=20, choices=ROLES, default='CONSULTA')
    email = models.EmailField(unique=True)
    departamento = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    ultimo_acceso = models.DateTimeField(null=True, blank=True)
    objects = UsuarioManager()

    def autenticar(self, password):
        """Autentica al usuario verificando la contraseña"""
        return self.check_password(password)

    def gestionar_permisos(self, nuevo_rol):
        """Actualiza el rol del usuario si el solicitante tiene permisos"""
        if nuevo_rol in dict(self.ROLES).keys():
            self.rol = nuevo_rol
            self.save()
            return True
        return False

    def tiene_permiso(self, permiso_requerido):
        """Verifica si el usuario tiene el permiso requerido"""
        permisos = {
            'ADMIN': ['crear', 'editar', 'eliminar', 'asignar', 'reportes','consultar'],
            'GESTOR': ['crear', 'editar', 'asignar', 'reportes','consultar'],
            'AUDITOR': ['editar', 'reportes','consultar'],
            'CONSULTA': ['consultar']
        }
        return permiso_requerido in permisos.get(self.rol, [])

    def __str__(self):
        return f"{self.username} ({self.get_rol_display()})"

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    vida_util = models.PositiveIntegerField(help_text="Vida útil en años", default=5)
    tasa_depreciacion = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        help_text="Tasa anual de depreciación en porcentaje", 
        default=10.00
    )
    activa = models.BooleanField(default=True)

    def agregar_categoria(self):
        """Guarda una nueva categoría con validación de nombre único"""
        try:
            self.save()
            return True, "Categoría creada exitosamente"
        except Exception as e:
            return False, str(e)

    def actualizar_categoria(self, **kwargs):
        """Actualiza los campos de la categoría"""
        for field, value in kwargs.items():
            setattr(self, field, value)
        try:
            self.save()
            return True, "Categoría actualizada exitosamente"
        except Exception as e:
            return False, str(e)

    def desactivar(self):
        """Desactiva la categoría si no tiene bienes asociados"""
        if self.bienpatrimonial_set.count() == 0:
            self.activa = False
            self.save()
            return True, "Categoría desactivada"
        return False, "No se puede desactivar, tiene bienes asociados"

    def __str__(self):
        return f"{self.nombre} ({self.tasa_depreciacion}%)"

class Ubicacion(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    edificio = models.CharField(max_length=100)
    piso = models.CharField(max_length=20)
    oficina = models.CharField(max_length=50)
    direccion = models.TextField()
    responsable = models.ForeignKey('Responsable', on_delete=models.SET_NULL, null=True, blank=True)
    capacidad = models.PositiveIntegerField(default=1)
    ocupados = models.PositiveIntegerField(default=0)

    def mover_bien(self, bien, nueva_ubicacion):
        """Mueve un bien a una nueva ubicación actualizando contadores"""
        if nueva_ubicacion.ocupados >= nueva_ubicacion.capacidad:
            return False, "La ubicación destino está llena"
        
        # Liberar espacio en ubicación actual
        if bien.ubicacion:
            bien.ubicacion.ocupados -= 1
            bien.ubicacion.save()
        
        # Asignar nueva ubicación
        bien.ubicacion = nueva_ubicacion
        bien.save()
        
        # Actualizar contadores
        nueva_ubicacion.ocupados += 1
        nueva_ubicacion.save()
        
        # Registrar movimiento
        Movimiento.objects.create(
            tipo='TRASLADO',
            descripcion=f"Traslado de {self} a {nueva_ubicacion}",
            bien=bien,
            responsable=bien.responsable,
            origen=self,
            destino=nueva_ubicacion
        )
        
        return True, f"Bien movido a {nueva_ubicacion}"

    def espacio_disponible(self):
        return self.capacidad - self.ocupados

    def __str__(self):
        return f"{self.edificio} - Piso {self.piso} - {self.oficina} ({self.codigo})"

class Responsable(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    cargo = models.CharField(max_length=100)
    departamento = models.CharField(max_length=100)
    fecha_asignacion = models.DateField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def asignar_bien(self, bien):
        """Asigna un bien a este responsable"""
        if not self.activo:
            return False, "Responsable inactivo, no puede recibir bienes"
        
        bien.responsable = self
        bien.save()
        
        # Registrar movimiento
        Movimiento.objects.create(
            tipo='ASIGNACION',
            descripcion=f"Asignación a {self}",
            bien=bien,
            responsable=self,
            destino=bien.ubicacion
        )
        
        return True, f"Bien {bien.codigo} asignado a {self}"


    def bienes_asignados(self):
        """Devuelve los bienes asignados a este responsable"""
        return self.bienpatrimonial_set.all()

    def cantidad_bienes(self):
        """Cuenta los bienes asignados"""
        return self.bienes_asignados().count()

    def __str__(self):
        return f"{self.usuario.get_full_name()} ({self.cargo})"

class BienPatrimonial(models.Model):
    ESTADOS = (
        ('BUENO', 'Buen estado'),
        ('REGULAR', 'Estado regular'),
        ('MALO', 'Mal estado'),
        ('BAJA', 'Dado de baja'),
        ('REPARACION', 'En reparación'),
    )
    
    codigo = models.CharField(max_length=50, unique=True)
    serie = models.CharField(max_length=100, blank=True, null=True)
    descripcion = models.TextField()
    marca = models.CharField(max_length=100, blank=True, null=True)
    modelo = models.CharField(max_length=100, blank=True, null=True)
    valor_adquisicion = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    fecha_adquisicion = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='BUENO')
    depreciacion = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    valor_residual = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT)
    ubicacion = models.ForeignKey(Ubicacion, on_delete=models.PROTECT)
    responsable = models.ForeignKey(Responsable, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    def calcular_depreciacion(self, fecha_calculo=None):
        """Calcula la depreciación acumulada hasta la fecha especificada"""
        if not fecha_calculo:
            fecha_calculo = date.today()
        
        # No depreciar si está dado de baja
        if self.estado == 'BAJA':
            self.depreciacion = self.valor_adquisicion - self.valor_residual
            self.save()
            return self.depreciacion
        
        # Calcular años transcurridos
        años = fecha_calculo.year - self.fecha_adquisicion.year
        
        # Ajustar por meses si no ha cumplido año completo
        if fecha_calculo.month < self.fecha_adquisicion.month or \
           (fecha_calculo.month == self.fecha_adquisicion.month and fecha_calculo.day < self.fecha_adquisicion.day):
            años -= 1
        
        # Calcular depreciación máxima permitida
        depreciacion_maxima = float(self.valor_adquisicion) - float(self.valor_residual)
        
        # Calcular depreciación acumulada
        tasa_anual = float(self.categoria.tasa_depreciacion) / 100
        depreciacion_acumulada = min(años * tasa_anual * float(self.valor_adquisicion), depreciacion_maxima)
        
        self.depreciacion = depreciacion_acumulada
        self.save()
        
        # Registrar en historial
        HistorialAuditoria.objects.create(
            usuario=Usuario.objects.get(username='sistema'),
            accion="CÁLCULO DEPRECIACIÓN",
            detalle=f"Depreciación calculada: {self.depreciacion}",
            bien=self
        )
        
        return self.depreciacion

    def valor_actual(self):
        """Calcula el valor actual del bien"""
        return float(self.valor_adquisicion) - float(self.depreciacion)

    def actualizar_estado(self, nuevo_estado, usuario, observaciones=None):
        """Actualiza el estado del bien con registro de auditoría"""
        if nuevo_estado not in dict(self.ESTADOS).keys():
            return False, "Estado no válido"
        
        estado_anterior = self.estado
        self.estado = nuevo_estado
        
        # Si se da de baja, depreciar completamente
        if nuevo_estado == 'BAJA':
            self.depreciacion = float(self.valor_adquisicion) - float(self.valor_residual)
            self.activo = False
        
        self.save()
        
        # Registrar en historial
        detalle = f"Cambio de estado: {estado_anterior} → {nuevo_estado}"
        if observaciones:
            detalle += f" | Observaciones: {observaciones}"
        
        HistorialAuditoria.objects.create(
            usuario=usuario,
            accion="CAMBIO ESTADO",
            detalle=detalle,
            bien=self
        )
        
        return True, "Estado actualizado correctamente"
    
    def dar_baja(self, usuario, motivo, fecha_baja=None):
        if not fecha_baja:
            fecha_baja = date.today()
        self.estado = 'BAJA'
        self.motivo_baja = motivo
        self.fecha_baja = fecha_baja
        self.save()
        Movimiento.objects.create(
            tipo='BAJA',
            descripcion=f"Baja del bien. Motivo: {motivo}",
            bien=self,
            responsable=self.responsable,
            origen=self.ubicacion,
            usuario_registro=usuario
        )
        # Actualizar estado
        success, message = self.actualizar_estado('BAJA', usuario, motivo)
        if not success:
            return False, message

        # Liberar responsable si lo tiene
        try:
            if self.responsable:
                self.responsable.liberar_bien(self)
        except Exception as e:
            print(f"Error al liberar responsable: {e}")

        # Liberar ubicación
        try:
            if self.ubicacion:
                self.ubicacion.ocupados -= 1
                self.ubicacion.save()
        except Exception as e:
            print(f"Error al liberar ubicación: {e}")

        return True, "Bien dado de baja correctamente"

def generar_codigo_qr(self):
        """Genera un código QR con información del bien"""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        info = f"Bien: {self.codigo}\nDesc: {self.descripcion[:50]}\nValor: {self.valor_actual():.2f}\nEstado: {self.get_estado_display()}"
        qr.add_data(info)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer)
        
        return File(buffer, name=f'qr_{self.codigo}.png')

def __str__(self):
        return f"{self.codigo} - {self.descripcion[:50]}..."

class Movimiento(models.Model):
    TIPOS = (
        ('ASIGNACION', 'Asignación'),
        ('TRASLADO', 'Traslado'),
        ('BAJA', 'Baja'),
        ('MANTENIMIENTO', 'Mantenimiento'),
        ('LIBERACION', 'Liberación'),
        ('REPARACION', 'Enviado a reparación'),
        ('RETORNO', 'Retorno de reparación'),
    )
    
    tipo = models.CharField(max_length=20, choices=TIPOS)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField()
    observaciones = models.TextField(blank=True, null=True)
    bien = models.ForeignKey(BienPatrimonial, on_delete=models.CASCADE, related_name='movimientos')
    responsable = models.ForeignKey(Responsable, on_delete=models.PROTECT)
    origen = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, related_name='movimientos_origen', null=True, blank=True)
    destino = models.ForeignKey(Ubicacion, on_delete=models.PROTECT, related_name='movimientos_destino', null=True, blank=True)
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.PROTECT)

    def registrar_movimiento(self):
        """Registra el movimiento y actualiza el estado del bien según corresponda"""
        try:
            self.save()
            
            # Actualizar estado del bien según tipo de movimiento
            if self.tipo == 'REPARACION':
                self.bien.actualizar_estado('REPARACION', self.usuario_registro, "Enviado a reparación")
            elif self.tipo == 'RETORNO':
                self.bien.actualizar_estado('BUENO', self.usuario_registro, "Retorno de reparación")
            
            # Notificar al responsable
            if self.responsable.usuario.email:
                Notificacion.objects.create(
                    mensaje=f"Nuevo movimiento registrado para el bien {self.bien.codigo}: {self.get_tipo_display()}",
                    responsable=self.responsable
                )
            
            return True, "Movimiento registrado exitosamente"
        except Exception as e:
            return False, str(e)

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.bien.codigo} ({self.fecha.date()})"

class Reporte(models.Model):
    TIPOS = (
        ('INVENTARIO', 'Inventario'),
        ('DEPRECIACION', 'Depreciación'),
        ('ESTADO', 'Estado de bienes'),
        ('MOVIMIENTOS', 'Movimientos'),
        ('BAJAS', 'Bajas'),
        ('MANTENIMIENTOS', 'Mantenimientos'),
    )
    
    FORMATOS = (
        ('PDF', 'PDF'),
        ('EXCEL', 'Excel'),
        ('HTML', 'HTML'),
        ('CSV', 'CSV'),
    )
    
    tipo = models.CharField(max_length=20, choices=TIPOS)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    contenido = models.TextField()
    formato = models.CharField(max_length=10, choices=FORMATOS, default='PDF')
    parametros = models.JSONField(default=dict)  # Almacena los filtros usados
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT, related_name='reportes')
    archivo = models.FileField(upload_to='reportes/', null=True, blank=True)

    def generar_reporte(self, filtros=None, formato='PDF'):
        """Genera el reporte según los filtros y formato especificado"""
        from django.template.loader import render_to_string # type: ignore
        import pandas as pd # type: ignore
        from weasyprint import HTML # type: ignore
        import tempfile
        
        if not filtros:
            filtros = {}
        
        self.parametros = filtros
        self.formato = formato
        
        # Obtener datos según tipo de reporte
        if self.tipo == 'INVENTARIO':
            queryset = BienPatrimonial.objects.filter(activo=True)
            if 'categoria' in filtros:
                queryset = queryset.filter(categoria_id=filtros['categoria'])
            if 'estado' in filtros:
                queryset = queryset.filter(estado=filtros['estado'])
            if 'ubicacion' in filtros:
                queryset = queryset.filter(ubicacion_id=filtros['ubicacion'])
            
            datos = list(queryset.values(
                'codigo', 'descripcion', 'valor_adquisicion', 'depreciacion', 
                'estado', 'categoria__nombre', 'ubicacion__edificio', 'ubicacion__oficina'
            ))
            
            contexto = {
                'titulo': 'Reporte de Inventario',
                'filtros': filtros,
                'datos': datos,
                'total_bienes': len(datos),
                'valor_total': sum(float(item['valor_adquisicion']) for item in datos),
                'depreciacion_total': sum(float(item['depreciacion']) for item in datos),
            }
        
        elif self.tipo == 'DEPRECIACION':
            # Lógica similar para otros tipos de reportes
            pass
        
        # Generar contenido según formato
        if formato == 'PDF':
            html_string = render_to_string('reportes/base.html', contexto)
            html = HTML(string=html_string)
            result = html.write_pdf()
            
            with tempfile.NamedTemporaryFile(delete=True) as output:
                output.write(result)
                self.archivo.save(f'reporte_{self.id}.pdf', File(output))
                self.contenido = "Reporte generado en PDF"
        
        elif formato == 'EXCEL':
            df = pd.DataFrame(datos)
            with tempfile.NamedTemporaryFile(delete=True) as output:
                df.to_excel(output.name, index=False)
                self.archivo.save(f'reporte_{self.id}.xlsx', File(output))
                self.contenido = "Reporte generado en Excel"
        
        self.save()
        return True, "Reporte generado exitosamente"

    def exportar_reportes(self, formato=None):
        """Exporta el reporte en el formato especificado"""
        if not formato:
            formato = self.formato
        
        if not self.archivo:
            success, message = self.generar_reporte(self.parametros, formato)
            if not success:
                return False, message
        
        # En una implementación real, aquí iría la lógica para enviar el archivo
        return True, f"Reporte listo para exportar en formato {formato}"

    def __str__(self):
        return f"Reporte de {self.get_tipo_display()} - {self.fecha_generacion.date()}"

class HistorialAuditoria(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    accion = models.CharField(max_length=100)
    detalle = models.TextField()
    bien = models.ForeignKey(BienPatrimonial, on_delete=models.CASCADE, related_name='auditorias')
    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['-fecha']
        verbose_name_plural = 'Historial de Auditoría'

    def __str__(self):
        return f"{self.fecha} - {self.usuario.username} - {self.accion}"

class DocumentoAdjunto(models.Model):
    TIPOS = (
        ('FACTURA', 'Factura'),
        ('GARANTIA', 'Garantía'),
        ('CONTRATO', 'Contrato'),
        ('FOTO', 'Fotografía'),
        ('OTRO', 'Otro documento'),
    )
    
    tipo = models.CharField(max_length=20, choices=TIPOS)
    ruta_archivo = models.FileField(upload_to='documentos_bienes/')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    bien = models.ForeignKey(BienPatrimonial, on_delete=models.CASCADE, related_name='documentos')
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    descripcion = models.TextField(blank=True, null=True)
    fecha_documento = models.DateField(null=True, blank=True)

    def save(self, *args, **kwargs):
        """Extiende el método save para registrar en el historial"""
        super().save(*args, **kwargs)
        
        HistorialAuditoria.objects.create(
            usuario=self.usuario,
            accion="DOCUMENTO ADJUNTO",
            detalle=f"Documento {self.get_tipo_display()} agregado: {self.descripcion}",
            bien=self.bien
        )

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.bien.codigo}"

class Notificacion(models.Model):
    ESTADOS = (
        ('NO_LEIDO', 'No leído'),
        ('LEIDO', 'Leído'),
        ('ARCHIVADO', 'Archivado'),
    )
    
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='NO_LEIDO')
    usuarios = models.ManyToManyField(Usuario, related_name='notificaciones', blank=True)
    responsables = models.ManyToManyField(Responsable, related_name='notificaciones', blank=True)
    url = models.URLField(blank=True, null=True)
    importante = models.BooleanField(default=False)

    def marcar_como_leido(self, usuario):
        """Marca la notificación como leída para un usuario específico"""
        if usuario in self.usuarios.all():
            self.estado = 'LEIDO'
            self.save()
            return True
        return False

    def enviar(self):
        """Envía la notificación a los destinatarios"""
        # En una implementación real, aquí podría ir el envío por email
        # o la integración con un sistema de notificaciones en tiempo real
        self.save()
        return True

    def __str__(self):
        return f"Notificación - {self.mensaje[:50]}..."

class Mantenimiento(models.Model):
    TIPOS = (
        ('PREVENTIVO', 'Preventivo'),
        ('CORRECTIVO', 'Correctivo'),
        ('PREDICTIVO', 'Predictivo'),
    )
    
    ESTADOS = (
        ('PENDIENTE', 'Pendiente'),
        ('EN_PROCESO', 'En proceso'),
        ('COMPLETADO', 'Completado'),
        ('CANCELADO', 'Cancelado'),
    )
    
    tipo = models.CharField(max_length=20, choices=TIPOS)
    descripcion = models.TextField()
    fecha_programada = models.DateField()
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    costo = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], null=True, blank=True)
    bien = models.ForeignKey(BienPatrimonial, on_delete=models.CASCADE, related_name='mantenimientos')
    proveedor = models.CharField(max_length=200, blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='PENDIENTE')
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    observaciones = models.TextField(blank=True, null=True)

    def iniciar_mantenimiento(self, usuario):
        """Marca el mantenimiento como en proceso"""
        if self.estado != 'PENDIENTE':
            return False, "Solo se pueden iniciar mantenimientos pendientes"
        
        self.estado = 'EN_PROCESO'
        self.fecha_inicio = date.today()
        self.save()
        
        # Registrar movimiento
        Movimiento.objects.create(
            tipo='MANTENIMIENTO',
            descripcion=f"Inicio de mantenimiento {self.get_tipo_display()}",
            bien=self.bien,
            responsable=self.bien.responsable,
            usuario_registro=usuario
        )
        
        # Actualizar estado del bien
        self.bien.actualizar_estado('REPARACION', usuario, "En mantenimiento")
        
        return True, "Mantenimiento iniciado correctamente"

    def finalizar_mantenimiento(self, usuario, observaciones=None, costo=None):
        """Marca el mantenimiento como completado"""
        if self.estado != 'EN_PROCESO':
            return False, "Solo se pueden finalizar mantenimientos en proceso"
        
        self.estado = 'COMPLETADO'
        self.fecha_fin = date.today()
        if costo is not None:
            self.costo = costo
        if observaciones:
            self.observaciones = observaciones
        self.save()
        
        # Registrar movimiento
        Movimiento.objects.create(
            tipo='RETORNO',
            descripcion=f"Fin de mantenimiento {self.get_tipo_display()}",
            bien=self.bien,
            responsable=self.bien.responsable,
            usuario_registro=usuario
        )
        
        # Actualizar estado del bien
        self.bien.actualizar_estado('BUENO', usuario, "Mantenimiento completado")
        
        return True, "Mantenimiento finalizado correctamente"

    def duracion(self):
        """Calcula la duración del mantenimiento en días"""
        if not self.fecha_inicio or not self.fecha_fin:
            return None
        return (self.fecha_fin - self.fecha_inicio).days

    def __str__(self):
        return f"Mantenimiento {self.get_tipo_display()} - {self.bien.codigo}"

class EtiquetaDigital(models.Model):
    ESTADOS = (
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),
        ('PERDIDO', 'Perdido'),
        ('DANADO', 'Dañado'),
    )
    
    codigo_qr = models.CharField(max_length=100, unique=True)
    codigo_nfc = models.CharField(max_length=100, unique=True, blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='ACTIVO')
    bien = models.OneToOneField(BienPatrimonial, on_delete=models.CASCADE, related_name='etiqueta_digital')
    fecha_activacion = models.DateField(auto_now_add=True)
    fecha_actualizacion = models.DateField(auto_now=True)
    imagen_qr = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    def generar_codigo_qr(self):
        """Genera y guarda la imagen del código QR"""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        
        info = f"""
        Bien Patrimonial
        Código: {self.bien.codigo}
        Descripción: {self.bien.descripcion[:50]}
        Valor: {self.bien.valor_actual():.2f}
        Estado: {self.bien.get_estado_display()}
        Responsable: {self.bien.responsable}
        QR: {self.codigo_qr}
        """
        
        qr.add_data(info)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        
        self.imagen_qr.save(f'qr_{self.bien.codigo}.png', File(buffer), save=False)
        self.save()

    def desactivar(self):
        """Desactiva la etiqueta digital"""
        self.estado = 'INACTIVO'
        self.save()
        return True

    def __str__(self):
        return f"Etiqueta {self.codigo_qr} - {self.estado}"

# Señales y funciones auxiliares

@receiver(post_save, sender=BienPatrimonial)
def crear_etiqueta_digital(sender, instance, created, **kwargs):
    """Crea automáticamente una etiqueta digital al crear un bien"""
    if created and not hasattr(instance, 'etiqueta_digital'):
        codigo_qr = f"BP-{instance.codigo}-{instance.id}"
        etiqueta = EtiquetaDigital.objects.create(
            codigo_qr=codigo_qr,
            bien=instance
        )
        etiqueta.generar_codigo_qr()

@receiver(post_save, sender=Movimiento)
def notificar_movimiento(sender, instance, created, **kwargs):
    if created and instance.responsable:
        notificacion = Notificacion.objects.create(
            mensaje=f"Nuevo movimiento registrado: {instance.get_tipo_display()} para el bien {instance.bien.codigo}",
            url=f"/bienes/{instance.bien.id}/movimientos"
        )
        notificacion.responsables.set([instance.responsable])

@receiver(post_save, sender=Mantenimiento)
def programar_notificacion_mantenimiento(sender, instance, created, **kwargs):
    if created:
        # Notificar al responsable
        if instance.bien.responsable:
            notificacion = Notificacion.objects.create(
                mensaje=f"Mantenimiento {instance.get_tipo_display()} programado para el bien {instance.bien.codigo}",
                importante=True,
                url=f"/bienes/{instance.bien.id}/mantenimientos"
            )
            notificacion.responsables.set([instance.bien.responsable])
        
        # Notificar al usuario que lo registró
        notificacion2 = Notificacion.objects.create(
            mensaje=f"Has registrado un mantenimiento para el bien {instance.bien.codigo}",
            url=f"/bienes/{instance.bien.id}/mantenimientos"
        )
        notificacion2.usuarios.set([instance.usuario_registro])