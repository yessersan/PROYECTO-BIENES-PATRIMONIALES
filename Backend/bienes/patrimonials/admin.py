from django.contrib import admin

# Register your models here.
from .models import (
    Usuario, Categoria, Ubicacion, Responsable, BienPatrimonial,
    Movimiento, Reporte, HistorialAuditoria, DocumentoAdjunto,
    Notificacion, Mantenimiento, EtiquetaDigital
)

admin.site.register(Usuario)
admin.site.register(Categoria)
admin.site.register(Ubicacion)
admin.site.register(Responsable)
admin.site.register(BienPatrimonial)
admin.site.register(Movimiento)
admin.site.register(Reporte)
admin.site.register(HistorialAuditoria)
admin.site.register(DocumentoAdjunto)
admin.site.register(Notificacion)
admin.site.register(Mantenimiento)
admin.site.register(EtiquetaDigital)