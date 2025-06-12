from django.http import HttpResponse, JsonResponse
from django.conf import settings

from django.http import JsonResponse
from django.conf import settings

class PatrimonialsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Excluir rutas públicas y permitir preflight
        if request.path in ['/api/login/', '/api/registro/', '/api/auth/usuario/'] or request.method == 'OPTIONS':
            return self.get_response(request)

        # Verificar API key
        api_key = request.headers.get('X-API-KEY')
        if api_key and api_key == settings.API_KEY:
            return self.get_response(request)

        return JsonResponse({'error': "API key is missing or invalid."}, status=403)
