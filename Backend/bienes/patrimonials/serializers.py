from rest_framework import serializers
from patrimonials.models import (
    Usuario, Categoria, Ubicacion, Responsable, BienPatrimonial,
    Movimiento, Reporte, HistorialAuditoria, DocumentoAdjunto,
    Notificacion, Mantenimiento, EtiquetaDigital
)

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol', 'departamento', 'telefono', 'fecha_creacion', 'ultimo_acceso', 'first_name', 'last_name']
        read_only_fields = ['fecha_creacion', 'ultimo_acceso']

    def validate_rol(self, value):
        if value not in dict(Usuario.ROLES).keys():
            raise serializers.ValidationError("Rol no válido")
        return value
    
class RegistroSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'password', 'confirmPassword',
            'first_name', 'last_name', 'rol', 'departamento', 'telefono'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'departamento': {'required': False, 'allow_null': True, 'allow_blank': True},
            'telefono': {'required': False, 'allow_null': True, 'allow_blank': True}
        }

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion', 'vida_util', 'tasa_depreciacion', 'activa']

    def validate_nombre(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("El nombre no puede estar vacío.")
        qs = Categoria.objects.filter(nombre=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Ya existe una categoría con este nombre.")
        return value

class UbicacionSerializer(serializers.ModelSerializer):
    responsable = serializers.PrimaryKeyRelatedField(queryset=Responsable.objects.all(), allow_null=True)
    espacio_disponible = serializers.ReadOnlyField()

    latitud = serializers.DecimalField(max_digits=9, decimal_places=6, allow_null=True, required=False)
    longitud = serializers.DecimalField(max_digits=9, decimal_places=6, allow_null=True, required=False)


    class Meta:
        model = Ubicacion
        fields = [
            'id', 'codigo', 'edificio', 'piso', 'oficina', 'direccion',
            'responsable', 'capacidad', 'ocupados', 'espacio_disponible',
            'latitud', 'longitud'
        ]

class ResponsableSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), source='usuario', write_only=True)

    class Meta:
        model = Responsable
        fields = ['id', 'usuario', 'usuario_id', 'cargo', 'departamento', 'fecha_asignacion', 'activo']

class BienPatrimonialSerializer(serializers.ModelSerializer):

    class Meta:
        model = BienPatrimonial
        fields = [
            'id', 'codigo', 'serie', 'descripcion', 'marca', 'modelo', 'valor_adquisicion',
            'fecha_adquisicion', 'estado', 'depreciacion', 'valor_residual', 'categoria',
            'ubicacion', 'responsable', 'fecha_registro', 'fecha_actualizacion', 'activo', 'valor_actual'
        ]

    def validate_estado(self, value):
        if value not in dict(BienPatrimonial.ESTADOS).keys():
            raise serializers.ValidationError("Estado no válido")
        return value

class MovimientoSerializer(serializers.ModelSerializer):
    bien = serializers.SlugRelatedField(slug_field='codigo', queryset=BienPatrimonial.objects.all())
    responsable = serializers.SlugRelatedField(slug_field='usuario__username', queryset=Responsable.objects.all())
    origen = serializers.SlugRelatedField(slug_field='codigo', queryset=Ubicacion.objects.all(), allow_null=True)
    destino = serializers.SlugRelatedField(slug_field='codigo', queryset=Ubicacion.objects.all(), allow_null=True)
    usuario_registro = serializers.SlugRelatedField(slug_field='username', queryset=Usuario.objects.all())

    class Meta:
        model = Movimiento
        fields = ['id', 'tipo', 'fecha', 'descripcion', 'observaciones', 'bien', 'responsable', 'origen', 'destino', 'usuario_registro']
        read_only_fields = ['fecha']

    def validate_tipo(self, value):
        if value not in dict(Movimiento.TIPOS).keys():
            raise serializers.ValidationError("Tipo de movimiento no válido")
        return value

class ReporteSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    archivo = serializers.SerializerMethodField()

    class Meta:
        model = Reporte
        fields = [
            'id', 'tipo', 'fecha_generacion', 'contenido',
            'formato', 'parametros', 'usuario', 'archivo'
        ]
        read_only_fields = ['fecha_generacion', 'contenido', 'archivo']

    def get_archivo(self, obj):
        request = self.context.get('request')
        if obj.archivo and request:
            return request.build_absolute_uri(obj.archivo.url)
        elif obj.archivo:
            return obj.archivo.url
        return None

class HistorialAuditoriaSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())
    bien = serializers.PrimaryKeyRelatedField(queryset=BienPatrimonial.objects.all())

    class Meta:
        model = HistorialAuditoria
        fields = ['id', 'fecha', 'usuario', 'accion', 'detalle', 'bien', 'ip', 'user_agent']
        read_only_fields = ['fecha']

class DocumentoAdjuntoSerializer(serializers.ModelSerializer):
    bien = serializers.PrimaryKeyRelatedField(queryset=BienPatrimonial.objects.all())
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())

    class Meta:
        model = DocumentoAdjunto
        fields = ['id', 'tipo', 'ruta_archivo', 'fecha_registro', 'bien', 'usuario', 'descripcion', 'fecha_documento']
        read_only_fields = ['fecha_registro']

class NotificacionSerializer(serializers.ModelSerializer):
    usuarios = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), many=True, required=False)
    responsables = serializers.PrimaryKeyRelatedField(queryset=Responsable.objects.all(), many=True, required=False)

    class Meta:
        model = Notificacion
        fields = ['id', 'mensaje', 'fecha_envio', 'estado', 'usuarios', 'responsables', 'url', 'importante']
        read_only_fields = ['fecha_envio']

class MantenimientoSerializer(serializers.ModelSerializer):
    bien = serializers.PrimaryKeyRelatedField(queryset=BienPatrimonial.objects.all())
    usuario_registro = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())

    class Meta:
        model = Mantenimiento
        fields = [
            'id', 'tipo', 'descripcion', 'fecha_programada', 'fecha_inicio', 'fecha_fin',
            'costo', 'bien', 'proveedor', 'estado', 'usuario_registro', 'observaciones'
        ]
        read_only_fields = ['fecha_inicio', 'fecha_fin']

    def validate_tipo(self, value):
        if value not in dict(Mantenimiento.TIPOS).keys():
            raise serializers.ValidationError("Tipo de mantenimiento no válido")
        return value

    def validate_estado(self, value):
        if value not in dict(Mantenimiento.ESTADOS).keys():
            raise serializers.ValidationError("Estado de mantenimiento no válido")
        return value

class EtiquetaDigitalSerializer(serializers.ModelSerializer):
    bien = serializers.PrimaryKeyRelatedField(queryset=BienPatrimonial.objects.all())

    class Meta:
        model = EtiquetaDigital
        fields = ['id', 'codigo_qr', 'codigo_nfc', 'estado', 'bien', 'fecha_activacion', 'fecha_actualizacion', 'imagen_qr']
        read_only_fields = ['fecha_activacion', 'fecha_actualizacion', 'imagen_qr']