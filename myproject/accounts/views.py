from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from .serializers import UserRegistrationSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            # Save the user and get the saved user object
            user = serializer.save()

            # Prepare the response data
            response_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'message': "User registered successfully!"
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            # You can return a token or something here for actual auth purposes
            return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    
class CheckTokenView(APIView):
    # The authentication class tells DRF to use JWTAuthentication for this view
    authentication_classes = [JWTAuthentication]
    # The permission class ensures that only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # If the token is valid, the request will proceed to this point
        return Response({
            'message': 'Token is valid',
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
            }
        })