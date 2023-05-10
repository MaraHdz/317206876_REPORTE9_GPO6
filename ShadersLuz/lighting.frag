#version 330 core
struct Material//estructura nueva
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;//brillo
};

struct Light//Estructura nueva
{
    vec3 position;
    
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos; //Recibe V de fragmento
in vec3 Normal; //Normal
in vec2 TexCoords; //coordenadas de textur

out vec4 color;

uniform vec3 viewPos; //posicion de vista
uniform Material material;
uniform Light light;

void main()
{
    // Ambient Obtener la parte ambiental y multiplicarla por la parte difusa
    vec3 ambient = light.ambient *material.diffuse;
    
    // Diffuse
    vec3 norm = normalize(Normal);//Se normaliza el vector N que estoy cachando
    vec3 lightDir = normalize(light.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0); //Valores de (0 a 1)
    //Tambien hago producto punto entre vN y el VdirLuz
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    //Parte difusa por la luz por el material
    
    // Specular
    vec3 viewDir = normalize(viewPos - FragPos);//Primero necesito la direccíon de la vista del usuaio
    //Para saber donde cae el brillo
    vec3 reflectDir = reflect(-lightDir, norm);//Direccion de refraccion a partir de la normal y el opuesto de la dir de la luz
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);//Producto ponto (0,1)
    //Se eleva a la potencia que le diga, entre mas grande el valor se ve más chico
    //Entre mas pequeño el valor el punto se ve mas grande
    vec3 specular = light.specular * (spec * material.specular);
    
    //Sumo el ambiente lo difuso y lo especular para tener un vector resultante
    vec3 result = ambient + diffuse + specular;
    color = vec4(result, 1.0f);
    // Todos estos calculos se hacen por frgmento por eso es caro computacionalmente
}