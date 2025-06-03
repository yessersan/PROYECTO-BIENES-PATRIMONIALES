from rest_framework import serializers
from patrimonials.models import (
    Usuario, Categoria, Ubicacion, Responsable, BienPatrimonial,
    Movimiento, Reporte, HistorialAuditoria, DocumentoAdjunto,
    Notificacion, Mantenimiento, EtiquetaDigital
)

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol', 'departamento', 'telefono', 'fecha_creacion', 'ultimo_acceso']
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
            'password': {'write_only': True}
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

class UbicacionSerializer(serializers.ModelSerializer):
    responsable = serializers.PrimaryKeyRelatedField(queryset=Responsable.objects.all(), allow_null=True)
    espacio_disponible = serializers.ReadOnlyField()

    class Meta:
        model = Ubicacion
        fields = ['id', 'codigo', 'edificio', 'piso', 'oficina', 'direccion', 'responsable', 'capacidad', 'ocupados', 'espacio_disponible']

class ResponsableSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), source='usuario', write_only=True)

    class Meta:
        model = Responsable
        fields = ['id', 'usuario', 'usuario_id', 'cargo', 'departamento', 'fecha_asignacion', 'activo']

class BienPatrimonialSerializer(serializers.ModelSerializer):
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all())
    ubicacion = serializers.PrimaryKeyRelatedField(queryset=Ubicacion.objects.all())
    responsable = serializers.PrimaryKeyRelatedField(queryset=Responsable.objects.all(), allow_null=True)
    valor_actual = serializers.ReadOnlyField()

    class Meta:
        model = BienPatrimonial
        fields = [
            'id', 'codigo', 'serie', 'descripcion', 'marca', 'modelo', 'valor_adquisicion',
            'fecha_adquisicion', 'estado', 'depreciacion', 'valor_residual', 'categoria',
            'ubicacion', 'responsable', 'fecha_registro', 'fecha_actualizacion', 'activo', 'valor_actual'
        ]
        read_only_fields = ['fecha_registro', 'fecha_actualizacion', 'depreciacion', 'valor_actual']

    def validate_estado(self, value):
        if value not in dict(BienPatrimonial.ESTADOS).keys():
            raise serializers.ValidationError("Estado no válido")
        return value

class MovimientoSerializer(serializers.ModelSerializer):
    bien = serializers.PrimaryKeyRelatedField(queryset=BienPatrimonial.objects.all())
    responsable = serializers.PrimaryKeyRelatedField(queryset=Responsable.objects.all())
    origen = serializers.PrimaryKeyRelatedField(queryset=Ubicacion.objects.all(), allow_null=True)
    destino = serializers.PrimaryKeyRelatedField(queryset=Ubicacion.objects.all(), allow_null=True)
    usuario_registro = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())

    class Meta:
        model = Movimiento
        fields = [
            'id', 'tipo', 'fecha', 'descripcion', 'observaciones', 'bien', 'responsable',
            'origen', 'destino', 'usuario_registro'
        ]
        read_only_fields = ['fecha']

    def validate_tipo(self, value):
        if value not in dict(Movimiento.TIPOS).keys():
            raise serializers.ValidationError("Tipo de movimiento no válido")
        return value

class ReporteSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())

    class Meta:
        model = Reporte
        fields = ['id', 'tipo', 'fecha_generacion', 'contenido', 'formato', 'parametros', 'usuario', 'archivo']
        read_only_fields = ['fecha_generacion', 'contenido', 'archivo']

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