<<<<<<< HEAD
from django.urls import path
from .views import (
    LoginView, UsuarioActualView, UsuarioListCreateView, UsuarioRetrieveUpdateDestroyView,
=======
from django.db import router
from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import (
    HistorialAuditoriaViewSet, LoginView, UsuarioActualView, UsuarioListCreateView, UsuarioRetrieveUpdateDestroyView,
>>>>>>> origin/yezer
    CategoriaListCreateView, CategoriaRetrieveUpdateDestroyView,
    UbicacionListCreateView, UbicacionRetrieveUpdateDestroyView,
    ResponsableListCreateView, ResponsableRetrieveUpdateDestroyView,
    BienPatrimonialListCreateView, BienPatrimonialRetrieveUpdateDestroyView,
    BienPatrimonialMoverView, BienPatrimonialDarBajaView,
    MovimientoListCreateView, MovimientoRetrieveUpdateDestroyView,
    ReporteListCreateView, ReporteRetrieveUpdateDestroyView,
    HistorialAuditoriaListView,
    DocumentoAdjuntoListCreateView, DocumentoAdjuntoRetrieveUpdateDestroyView,
    NotificacionListCreateView, NotificacionRetrieveUpdateDestroyView,
    MantenimientoListCreateView, MantenimientoRetrieveUpdateDestroyView,
    MantenimientoIniciarView, MantenimientoFinalizarView,
    EtiquetaDigitalListCreateView, EtiquetaDigitalRetrieveUpdateDestroyView,
<<<<<<< HEAD
    EtiquetaDigitalGenerarQRView,RegistroUsuarioAPIView
)
=======
    EtiquetaDigitalGenerarQRView, RegistroUsuarioAPIView
)
from . import views
router = DefaultRouter()
router.register(r'historial-auditoria', HistorialAuditoriaViewSet, basename='historial-auditoria')
>>>>>>> origin/yezer

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('usuarios/', UsuarioListCreateView.as_view(), name='usuario-list-create'),
    path('usuarios/<int:pk>/', UsuarioRetrieveUpdateDestroyView.as_view(), name='usuario-detail'),
<<<<<<< HEAD
=======
    path('usuarios/disponibles/', views.get_usuarios_disponibles, name='usuarios-disponibles'),
>>>>>>> origin/yezer
    path('categorias/', CategoriaListCreateView.as_view(), name='categoria-list-create'),
    path('categorias/<int:pk>/', CategoriaRetrieveUpdateDestroyView.as_view(), name='categoria-detail'),
    path('ubicaciones/', UbicacionListCreateView.as_view(), name='ubicacion-list-create'),
    path('ubicaciones/<int:pk>/', UbicacionRetrieveUpdateDestroyView.as_view(), name='ubicacion-detail'),
    path('responsables/', ResponsableListCreateView.as_view(), name='responsable-list-create'),
    path('responsables/<int:pk>/', ResponsableRetrieveUpdateDestroyView.as_view(), name='responsable-detail'),
    path('bienes/', BienPatrimonialListCreateView.as_view(), name='bien-list-create'),
    path('bienes/<int:pk>/', BienPatrimonialRetrieveUpdateDestroyView.as_view(), name='bien-detail'),
    path('bienes/<int:pk>/mover/', BienPatrimonialMoverView.as_view(), name='bien-mover'),
    path('bienes/<int:pk>/dar-baja/', BienPatrimonialDarBajaView.as_view(), name='bien-dar-baja'),
    path('movimientos/', MovimientoListCreateView.as_view(), name='movimiento-list-create'),
    path('movimientos/<int:pk>/', MovimientoRetrieveUpdateDestroyView.as_view(), name='movimiento-detail'),
    path('reportes/', ReporteListCreateView.as_view(), name='reporte-list-create'),
    path('reportes/<int:pk>/', ReporteRetrieveUpdateDestroyView.as_view(), name='reporte-detail'),
<<<<<<< HEAD
    path('historial-auditoria/', HistorialAuditoriaListView.as_view(), name='historial-auditoria-list'),
=======
    #path('historial-auditoria/', HistorialAuditoriaListView.as_view(), name='historial-auditoria-list'),
>>>>>>> origin/yezer
    path('documentos/', DocumentoAdjuntoListCreateView.as_view(), name='documento-list-create'),
    path('documentos/<int:pk>/', DocumentoAdjuntoRetrieveUpdateDestroyView.as_view(), name='documento-detail'),
    path('notificaciones/', NotificacionListCreateView.as_view(), name='notificacion-list-create'),
    path('notificaciones/<int:pk>/', NotificacionRetrieveUpdateDestroyView.as_view(), name='notificacion-detail'),
    path('mantenimientos/', MantenimientoListCreateView.as_view(), name='mantenimiento-list-create'),
    path('mantenimientos/<int:pk>/', MantenimientoRetrieveUpdateDestroyView.as_view(), name='mantenimiento-detail'),
    path('mantenimientos/<int:pk>/iniciar/', MantenimientoIniciarView.as_view(), name='mantenimiento-iniciar'),
    path('mantenimientos/<int:pk>/finalizar/', MantenimientoFinalizarView.as_view(), name='mantenimiento-finalizar'),
    path('etiquetas-digitales/', EtiquetaDigitalListCreateView.as_view(), name='etiqueta-digital-list-create'),
    path('etiquetas-digitales/<int:pk>/', EtiquetaDigitalRetrieveUpdateDestroyView.as_view(), name='etiqueta-digital-detail'),
<<<<<<< HEAD
    path('registro/', RegistroUsuarioAPIView.as_view(), name='registro'),
    path('etiquetas-digitales/<int:pk>/generar-qr/', EtiquetaDigitalGenerarQRView.as_view(), name='etiqueta-digital-generar-qr'),
     path('auth/usuario/', UsuarioActualView.as_view(), name='usuario-actual'),
=======
    path('auth/registro/', RegistroUsuarioAPIView.as_view(), name='registro'),
    path('etiquetas-digitales/<int:pk>/generar-qr/', EtiquetaDigitalGenerarQRView.as_view(), name='etiqueta-digital-generar-qr'),
    path('auth/usuario/', UsuarioActualView.as_view(), name='usuario-actual'),
    path('', include(router.urls)),

>>>>>>> origin/yezer
]