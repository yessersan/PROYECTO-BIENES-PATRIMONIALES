from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from patrimonials.models import (
    Usuario, Categoria, Ubicacion, Responsable, BienPatrimonial,
    Movimiento, Reporte, HistorialAuditoria, DocumentoAdjunto,
    Notificacion, Mantenimiento, EtiquetaDigital
)
from patrimonials.serializers import (
    RegistroSerializer, UsuarioSerializer, CategoriaSerializer, UbicacionSerializer, ResponsableSerializer,
    BienPatrimonialSerializer, MovimientoSerializer, ReporteSerializer,
    HistorialAuditoriaSerializer, DocumentoAdjuntoSerializer,
    NotificacionSerializer, MantenimientoSerializer, EtiquetaDigitalSerializer
)

class IsAuthenticatedWithPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        permission_map = {
            'GET': 'consultar',
            'POST': 'crear',
            'PUT': 'editar',
            'PATCH': 'editar',
            'DELETE': 'eliminar'
        }
        required_permission = permission_map.get(request.method, 'consultar')
        return request.user.tiene_permiso(required_permission)

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = UsuarioSerializer

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UsuarioSerializer(user).data
            })
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

class UsuarioActualView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
    
class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_create(self, serializer):
        serializer.save()
        HistorialAuditoria.objects.create(
            usuario=self.request.user,
            accion="CREACIÓN USUARIO",
            detalle=f"Usuario {serializer.instance.username} creado",
            bien=None
        )

class UsuarioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class RegistroUsuarioAPIView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

class CategoriaListCreateView(generics.ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_create(self, serializer):
        success, message = serializer.instance.agregar_categoria()
        if not success:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        HistorialAuditoria.objects.create(
            usuario=self.request.user,
            accion="CREACIÓN CATEGORÍA",
            detalle=f"Categoría {serializer.instance.nombre} creada",
            bien=None
        )

class CategoriaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_update(self, serializer):
        success, message = serializer.instance.actualizar_categoria(**serializer.validated_data)
        if not success:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

    def perform_destroy(self, instance):
        success, message = instance.desactivar()
        if not success:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

class UbicacionListCreateView(generics.ListCreateAPIView):
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class UbicacionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class ResponsableListCreateView(generics.ListCreateAPIView):
    queryset = Responsable.objects.all()
    serializer_class = ResponsableSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class ResponsableRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Responsable.objects.all()
    serializer_class = ResponsableSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class BienPatrimonialListCreateView(generics.ListCreateAPIView):
    queryset = BienPatrimonial.objects.all()
    serializer_class = BienPatrimonialSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_create(self, serializer):
        serializer.save()
        serializer.instance.calcular_depreciacion()
        HistorialAuditoria.objects.create(
            usuario=self.request.user,
            accion="CREACIÓN BIEN",
            detalle=f"Bien {serializer.instance.codigo} creado",
            bien=serializer.instance
        )

class BienPatrimonialRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BienPatrimonial.objects.all()
    serializer_class = BienPatrimonialSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_update(self, serializer):
        serializer.save()
        serializer.instance.calcular_depreciacion()

    def perform_destroy(self, instance):
        success, message = instance.dar_baja(self.request.user, motivo="Eliminación desde API")
        if not success:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

class BienPatrimonialMoverView(generics.GenericAPIView):
    queryset = BienPatrimonial.objects.all()
    serializer_class = BienPatrimonialSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def post(self, request, pk):
        try:
            bien = self.get_object()
            nueva_ubicacion_id = request.data.get('nueva_ubicacion_id')
            if not nueva_ubicacion_id:
                return Response({'error': 'Se requiere nueva_ubicacion_id'}, status=status.HTTP_400_BAD_REQUEST)
            nueva_ubicacion = Ubicacion.objects.get(id=nueva_ubicacion_id)
            success, message = bien.ubicacion.mover_bien(bien, nueva_ubicacion)
            if not success:
                return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'message': message}, status=status.HTTP_200_OK)
        except Ubicacion.DoesNotExist:
            return Response({'error': 'Ubicación no encontrada'}, status=status.HTTP_404_NOT_FOUND)

class BienPatrimonialDarBajaView(generics.GenericAPIView):
    queryset = BienPatrimonial.objects.all()
    serializer_class = BienPatrimonialSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def post(self, request, pk):
        try:
            bien = self.get_object()
            motivo = request.data.get('motivo', 'Baja desde API')
            success, message = bien.dar_baja(self.request.user, motivo)
            if not success:
                return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'message': message}, status=status.HTTP_200_OK)
        except BienPatrimonial.DoesNotExist:
            return Response({'error': 'Bien no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class MovimientoListCreateView(generics.ListCreateAPIView):
    queryset = Movimiento.objects.all()
    serializer_class = MovimientoSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_create(self, serializer):
        serializer.save(usuario_registro=self.request.user)
        success, message = serializer.instance.registrar_movimiento()
        if not success:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

class MovimientoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movimiento.objects.all()
    serializer_class = MovimientoSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class ReporteListCreateView(generics.ListCreateAPIView):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
        success, message = serializer.instance.generar_reporte(filtros=serializer.validated_data.get('parametros', {}))
        if not success:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

class ReporteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class HistorialAuditoriaListView(generics.ListAPIView):
    queryset = HistorialAuditoria.objects.all()
    serializer_class = HistorialAuditoriaSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class DocumentoAdjuntoListCreateView(generics.ListCreateAPIView):
    queryset = DocumentoAdjunto.objects.all()
    serializer_class = DocumentoAdjuntoSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class DocumentoAdjuntoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DocumentoAdjunto.objects.all()
    serializer_class = DocumentoAdjuntoSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class NotificacionListCreateView(generics.ListCreateAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_create(self, serializer):
        serializer.save()
        serializer.instance.enviar()

class NotificacionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_update(self, serializer):
        if 'estado' in serializer.validated_data and serializer.validated_data['estado'] == 'LEIDO':
            success = serializer.instance.marcar_como_leido(self.request.user)
            if not success:
                return Response({'error': 'Usuario no autorizado para marcar como leído'}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()

class MantenimientoListCreateView(generics.ListCreateAPIView):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_create(self, serializer):
        serializer.save(usuario_registro=self.request.user)

class MantenimientoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class MantenimientoIniciarView(generics.GenericAPIView):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def post(self, request, pk):
        try:
            mantenimiento = self.get_object()
            success, message = mantenimiento.iniciar_mantenimiento(self.request.user)
            if not success:
                return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'message': message}, status=status.HTTP_200_OK)
        except Mantenimiento.DoesNotExist:
            return Response({'error': 'Mantenimiento no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class MantenimientoFinalizarView(generics.GenericAPIView):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def post(self, request, pk):
        try:
            mantenimiento = self.get_object()
            observaciones = request.data.get('observaciones')
            costo = request.data.get('costo')
            success, message = mantenimiento.finalizar_mantenimiento(self.request.user, observaciones, costo)
            if not success:
                return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'message': message}, status=status.HTTP_200_OK)
        except Mantenimiento.DoesNotExist:
            return Response({'error': 'Mantenimiento no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class EtiquetaDigitalListCreateView(generics.ListCreateAPIView):
    queryset = EtiquetaDigital.objects.all()
    serializer_class = EtiquetaDigitalSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def perform_create(self, serializer):
        serializer.save()
        serializer.instance.generar_codigo_qr()

class EtiquetaDigitalRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EtiquetaDigital.objects.all()
    serializer_class = EtiquetaDigitalSerializer
    permission_classes = [IsAuthenticatedWithPermission]

class EtiquetaDigitalGenerarQRView(generics.GenericAPIView):
    queryset = EtiquetaDigital.objects.all()
    serializer_class = EtiquetaDigitalSerializer
    permission_classes = [IsAuthenticatedWithPermission]

    def post(self, request, pk):
        try:
            etiqueta = self.get_object()
            etiqueta.generar_codigo_qr()
            return Response({'message': 'Código QR generado exitosamente', 'qr_url': etiqueta.imagen_qr.url}, status=status.HTTP_200_OK)
        except EtiquetaDigital.DoesNotExist:
            return Response({'error': 'Etiqueta digital no encontrada'}, status=status.HTTP_404_NOT_FOUND)