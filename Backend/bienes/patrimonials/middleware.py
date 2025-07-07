<<<<<<< HEAD
from django.http import HttpResponse, JsonResponse
from django.conf import settings

=======
>>>>>>> origin/yezer
from django.http import JsonResponse
from django.conf import settings

class PatrimonialsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

<<<<<<< HEAD

        # Verificar API key
        api_key = request.headers.get('X-API-KEY')
        if api_key and api_key == settings.API_KEY:
            return self.get_response(request)

        return JsonResponse({'error': "API key is missing or invalid."}, status=403)
=======
    def __call__(self, request):
        # Permitir acceso a archivos de media sin API key
        if request.path.startswith('/media/') or request.path.startswith('/admin/'):
            return self.get_response(request)

        # Permitir peticiones OPTIONS (preflight CORS)
        if request.method == 'OPTIONS':
            return self.get_response(request)

        # Verificar API key en las rutas protegidas (por ejemplo, solo en /api/)
        if request.path.startswith('/api/'):
            api_key = request.headers.get('X-API-KEY')
            if not api_key or api_key != settings.API_KEY:
                return JsonResponse({'error': "API key is missing or invalid."}, status=403)

        # Continuar con la respuesta normal
        return self.get_response(request)
>>>>>>> origin/yezer
