const CEFR_CONVERSATION_PROMPTS = {

       A1: [
        {
            prompt_es: "¿Qué te gustaría beber?",
            prompt_en: "What would you like to drink?",
            expected_responses: [
                { es: "quiero agua por favor", en: "I want water please" },
                { es: "me gustaría una cerveza", en: "I would like a beer" },
                { es: "quiero café", en: "I want coffee" }
            ]
        },
        {
            prompt_es: "¿Cómo estás hoy?",
            prompt_en: "How are you today?",
            expected_responses: [
                { es: "estoy feliz", en: "I am happy" },
                { es: "estoy bien gracias", en: "I am good, thank you" },
                { es: "estoy cansado", en: "I am tired" }
            ]
        },
        {
            prompt_es: "¿Dónde vives?",
            prompt_en: "Where do you live?",
            expected_responses: [
                { es: "vivo en la casa", en: "I live in the house" },
                { es: "vivo cerca del hotel", en: "I live near the hotel" },
                { es: "vivo con mi familia", en: "I live with my family" }
            ]
        },
        {
            prompt_es: "¿Qué quieres comer?",
            prompt_en: "What do you want to eat?",
            expected_responses: [
                { es: "quiero pollo", en: "I want chicken" },
                { es: "quiero una ensalada", en: "I want a salad" },
                { es: "quiero sopa", en: "I want soup" }
            ]
        },
        {
            prompt_es: "¿Tienes hambre?",
            prompt_en: "Are you hungry?",
            expected_responses: [
                { es: "sí tengo hambre", en: "Yes, I'm hungry" },
                { es: "no tengo hambre", en: "I'm not hungry" },
                { es: "tengo un poco de hambre", en: "I'm a little hungry" }
            ]
        },
        {
            prompt_es: "¿Qué te gusta hacer?",
            prompt_en: "What do you like to do?",
            expected_responses: [
                { es: "me gusta leer libros", en: "I like reading books" },
                { es: "me gusta escuchar música", en: "I like listening to music" },
                { es: "me gusta cocinar", en: "I like cooking" }
            ]
        },
        {
            prompt_es: "¿A qué hora te levantas?",
            prompt_en: "What time do you get up?",
            expected_responses: [
                { es: "me levanto temprano", en: "I get up early" },
                { es: "me levanto tarde", en: "I get up late" },
                { es: "me levanto a las siete", en: "I get up at seven" }
            ]
        },
        {
            prompt_es: "¿Quieres salir hoy?",
            prompt_en: "Do you want to go out today?",
            expected_responses: [
                { es: "sí quiero salir", en: "Yes, I want to go out" },
                { es: "no quiero salir", en: "I don't want to go out" },
                { es: "quiero salir más tarde", en: "I want to go out later" }
            ]
        },
        {
            prompt_es: "¿Qué estás haciendo?",
            prompt_en: "What are you doing?",
            expected_responses: [
                { es: "estoy aprendiendo español", en: "I am learning Spanish" },
                { es: "estoy cocinando", en: "I am cooking" },
                { es: "estoy viendo televisión", en: "I am watching TV" }
            ]
        },
        {
            prompt_es: "¿Quieres ver una película?",
            prompt_en: "Do you want to watch a movie?",
            expected_responses: [
                { es: "sí quiero ver una película", en: "Yes, I want to watch a movie" },
                { es: "no quiero ver televisión", en: "I don't want to watch TV" },
                { es: "quiero ver una película nueva", en: "I want to watch a new movie" }
            ]
        },
        {
            prompt_es: "¿Dónde está el baño?",
            prompt_en: "Where is the bathroom?",
            expected_responses: [
                { es: "está cerca", en: "It is near" },
                { es: "está en la estación", en: "It is in the station" },
                { es: "está en la casa", en: "It is in the house" }
            ]
        },
        {
            prompt_es: "¿Qué música te gusta?",
            prompt_en: "What music do you like?",
            expected_responses: [
                { es: "me gusta la música", en: "I like music" },
                { es: "me gusta escuchar música", en: "I like listening to music" },
                { es: "me gusta la música nueva", en: "I like new music" }
            ]
        },
        {
            prompt_es: "¿Quieres descansar?",
            prompt_en: "Do you want to rest?",
            expected_responses: [
                { es: "sí quiero descansar", en: "Yes, I want to rest" },
                { es: "no quiero descansar", en: "I don't want to rest" },
                { es: "quiero descansar un poco", en: "I want to rest a little" }
            ]
        },
        {
            prompt_es: "¿Qué hay en la casa?",
            prompt_en: "What is in the house?",
            expected_responses: [
                { es: "hay pan", en: "There is bread" },
                { es: "hay arroz", en: "There is rice" },
                { es: "hay pollo", en: "There is chicken" }
            ]
        },
        {
            prompt_es: "¿Quieres ir al hotel?",
            prompt_en: "Do you want to go to the hotel?",
            expected_responses: [
                { es: "sí quiero ir al hotel", en: "Yes, I want to go to the hotel" },
                { es: "no quiero ir", en: "I don't want to go" },
                { es: "quiero ir más tarde", en: "I want to go later" }
            ]
        },
        {
            prompt_es: "¿Qué fruta te gusta?",
            prompt_en: "What fruit do you like?",
            expected_responses: [
                { es: "me gusta la manzana", en: "I like apple" },
                { es: "me gusta la naranja", en: "I like orange" },
                { es: "me gusta el plátano", en: "I like banana" }
            ]
        },
        {
            prompt_es: "¿Quieres aprender más?",
            prompt_en: "Do you want to learn more?",
            expected_responses: [
                { es: "sí quiero aprender más", en: "Yes, I want to learn more" },
                { es: "quiero aprender rápido", en: "I want to learn fast" },
                { es: "quiero aprender con música", en: "I want to learn with music" }
            ]
        },
        {
            prompt_es: "¿Qué ves en la televisión?",
            prompt_en: "What do you watch on TV?",
            expected_responses: [
                { es: "veo libros", en: "I look at books" },
                { es: "veo cosas buenas", en: "I watch good things" },
                { es: "veo música nueva", en: "I watch new music videos" }
            ]
        },
        {
            prompt_es: "¿Quieres pan con queso?",
            prompt_en: "Do you want bread with cheese?",
            expected_responses: [
                { es: "sí quiero pan con queso", en: "Yes, I want bread with cheese" },
                { es: "no quiero pan", en: "I don't want bread" },
                { es: "quiero queso", en: "I want cheese" }
            ]
        },
        {
            prompt_es: "¿Dónde está tu familia?",
            prompt_en: "Where is your family?",
            expected_responses: [
                { es: "está en la casa", en: "They are at home" },
                { es: "está cerca", en: "They are near" },
                { es: "está en la estación", en: "They are at the station" }
            ]
        },
        {
            prompt_es: "¿Quieres ir en autobús?",
            prompt_en: "Do you want to go by bus?",
            expected_responses: [
                { es: "sí quiero ir en autobús", en: "Yes, I want to go by bus" },
                { es: "no quiero ir en autobús", en: "I don't want to go by bus" },
                { es: "quiero ir en tren", en: "I want to go by train" }
            ]
        },
        {
            prompt_es: "¿Qué haces en casa?",
            prompt_en: "What do you do at home?",
            expected_responses: [
                { es: "cocino", en: "I cook" },
                { es: "leo libros", en: "I read books" },
                { es: "veo televisión", en: "I watch TV" }
            ]
        },
        {
            prompt_es: "¿Hola, tienes su boleto?",
            prompt_en: "Hello, do you have your ticket?",
            expected_responses: [
                { es: "sí tengo su boleto", en: "Yes, I have your ticket" },
                { es: "no tengo mi boleto", en: "I don't have my ticket" },
                { es: "necesito un boleto", en: "I need a ticket" }
            ]
        },
        {
            prompt_es: "¿Qué necesitas en la estación?",
            prompt_en: "What do you need at the station?",
            expected_responses: [
                { es: "necesito el autobús", en: "I need the bus" },
                { es: "necesito el tren", en: "I need the train" },
                { es: "necesito mi amigo", en: "I need my friend" }
            ]
        },
        {
            prompt_es: "¿Quieres café o té?",
            prompt_en: "Do you want coffee or tea?",
            expected_responses: [
                { es: "quiero café caliente", en: "I want hot coffee" },
                { es: "quiero té frío", en: "I want cold tea" },
                { es: "no quiero café", en: "I don't want coffee" }
            ]
        },
        {
            prompt_es: "¿Quién es ella?",
            prompt_en: "Who is she?",
            expected_responses: [
                { es: "ella es mi madre", en: "She is my mother" },
                { es: "ella es mi hermana", en: "She is my sister" },
                { es: "ella es mi amiga", en: "She is my friend (female)" }
            ]
        },
        {
            prompt_es: "¿Quién es el?",
            prompt_en: "Who is he?",
            expected_responses: [
                { es: "el es mi padre", en: "He is my father" },
                { es: "el es mi hijo", en: "He is my son" },
                { es: "el es mi amigo", en: "He is my friend" }
            ]
        },
        {
            prompt_es: "¿Hay problemas con el transporte?",
            prompt_en: "Are there problems with the transport?",
            expected_responses: [
                { es: "no hay problemas hoy", en: "There are no problems today" },
                { es: "sí hay problemas con el tren", en: "Yes, there are problems with the train" },
                { es: "el autobús es lento", en: "The bus is slow" }
            ]
        },
        {
            prompt_es: "¿Qué quieres aprender hoy?",
            prompt_en: "What do you want to learn today?",
            expected_responses: [
                { es: "quiero aprender a cocinar", en: "I want to learn to cook" },
                { es: "quiero aprender a escribir", en: "I want to learn to write" },
                { es: "quiero aprender más", en: "I want to learn more" }
            ]
        },
        {
            prompt_es: "¿Quieres comer filete hoy?",
            prompt_en: "Do you want to eat steak today?",
            expected_responses: [
                { es: "sí con papas fritas", en: "Yes, with french fries" },
                { es: "no quiero filete hoy", en: "I don't want steak today" },
                { es: "quiero sopa caliente", en: "I want hot soup" }
            ]
        },
        {
            prompt_es: "¿Dónde está la escuela?",
            prompt_en: "Where is the school?",
            expected_responses: [
                { es: "la escuela está cerca", en: "The school is near" },
                { es: "está cerca del hotel", en: "It is near the hotel" },
                { es: "no está cerca", en: "It is not near" }
            ]
        },
        {
            prompt_es: "¿Tienes leche o cerveza en casa?",
            prompt_en: "Do you have milk or beer at home?",
            expected_responses: [
                { es: "tengo leche y pan", en: "I have milk and bread" },
                { es: "tengo cerveza frío", en: "I have cold beer" },
                { es: "no tengo cerveza en casa", en: "I don't have beer at home" }
            ]
        },
        {
            prompt_es: "¿A qué hora vas a trabajar?",
            prompt_en: "What hour do you go to work?",
            expected_responses: [
                { es: "voy temprano", en: "I go early" },
                { es: "voy tarde hoy", en: "I go late today" },
                { es: "no voy a trabajar hoy", en: "I don't go to work today" }
            ]
        },
        {
            prompt_es: "¿Cómo está su abuela?",
            prompt_en: "How is your grandmother?",
            expected_responses: [
                { es: "su abuela está muy feliz", en: "His grandmother is very happy" },
                { es: "ella está bien gracias", en: "She is well, thank you" },
                { es: "está cansada hoy", en: "She is tired today" }
            ]
        },
        {
            prompt_es: "¿Quieres escuchar música nueva?",
            prompt_en: "Do you want to listen to new music?",
            expected_responses: [
                { es: "sí me gusta la música", en: "Yes, I like music" },
                { es: "no quiero escuchar música", en: "I don't want to listen to music" },
                { es: "quiero escuchar con mi amigo", en: "I want to listen with my friend" }
            ]
        },
        {
            prompt_es: "¿Qué necesitas limpiar hoy?",
            prompt_en: "What do you need to clean today?",
            expected_responses: [
                { es: "necesito limpiar la casa", en: "I need to clean the house" },
                { es: "necesito limpiar el baño", en: "I need to clean the bathroom" },
                { es: "no necesito limpiar hoy", en: "I don't need to clean today" }
            ]
        },
        {
            prompt_es: "¿Te gustan los libros nuevos?",
            prompt_en: "Do you like new books?",
            expected_responses: [
                { es: "sí me gusta leer mucho", en: "Yes, I like reading a lot" },
                { es: "no me gustan los libros", en: "I don't like books" },
                { es: "quiero escribir un libro", en: "I want to write a book" }
            ]
        },
        {
            prompt_es: "¿Hay fruta en la mesa?",
            prompt_en: "Is there fruit on the table?",
            expected_responses: [
                { es: "hay manzana y naranja", en: "There is apple and orange" },
                { es: "hay un plátano bueno", en: "There is a good banana" },
                { es: "no hay fruta hoy", en: "There is no fruit today" }
            ]
        },
        {
            prompt_es: "¿Quieres arroz con frijoles?",
            prompt_en: "Do you want rice with beans?",
            expected_responses: [
                { es: "sí con un poco de queso", en: "Yes, with a little cheese" },
                { es: "quiero arroz sin frijoles", en: "I want rice without beans" },
                { es: "no quiero arroz hoy", en: "I don't want rice today" }
            ]
        },
        {
            prompt_es: "¿Buenos días, estás listo?",
            prompt_en: "Good morning, are you ready?",
            expected_responses: [
                { es: "buenos días sí estoy listo", en: "Good morning, yes I am ready" },
                { es: "no estoy listo hoy", en: "I am not ready today" },
                { es: "necesito más tiempo por favor", en: "I need more time please" }
            ]
        },
        {
            prompt_es: "¿Cuándo vas al aeropuerto?",
            prompt_en: "When do you go to the airport?",
            expected_responses: [
                { es: "voy ahora", en: "I am going now" },
                { es: "voy temprano hoy", en: "I am going early today" },
                { es: "voy en autobús más tarde", en: "I am going by bus later" }
            ]
        },
        {
            prompt_es: "¿Te gusta este lugar nuevo?",
            prompt_en: "Do you like this new place?",
            expected_responses: [
                { es: "sí el lugar es muy bueno", en: "Yes, the place is very good" },
                { es: "no me gusta este lugar", en: "I don't like this place" },
                { es: "es un lugar pequeño", en: "It is a small place" }
            ]
        },
        {
            prompt_es: "¿Quieres un filete con papas fritas?",
            prompt_en: "Do you want a steak with french fries?",
            expected_responses: [
                { es: "sí, con un poco de sal", en: "Yes, with a little salt" },
                { es: "no, quiero una ensalada", en: "No, I want a salad" },
                { es: "quiero filete sin papas", en: "I want steak without fries" }
            ]
        },
        {
            prompt_es: "¿A qué hora termina la televisión?",
            prompt_en: "What hour does the television finish?",
            expected_responses: [
                { es: "termina a las diez", en: "It finishes at ten" },
                { es: "termina en una hora", en: "It finishes in an hour" },
                { es: "no veo televisión hoy", en: "I don't watch TV today" }
            ]
        },
        {
            prompt_es: "¿Qué fruta hay en la casa?",
            prompt_en: "What fruit is there in the house?",
            expected_responses: [
                { es: "hay manzana y plátano", en: "There is apple and banana" },
                { es: "hay naranja dulce", en: "There is sweet orange" },
                { es: "no hay fruta aquí", en: "There is no fruit here" }
            ]
        },
        {
            prompt_es: "¿Dónde está la estación de tren?",
            prompt_en: "Where is the train station?",
            expected_responses: [
                { es: "la estación está cerca", en: "The station is near" },
                { es: "está cerca de la escuela", en: "It is near the school" },
                { es: "está lejos del hotel", en: "It is far from the hotel" }
            ]
        },
        {
            prompt_es: "¿Quieres escuchar música con tu amigo?",
            prompt_en: "Do you want to listen to music with your friend?",
            expected_responses: [
                { es: "sí, me gusta escuchar música", en: "Yes, I like to listen to music" },
                { es: "no, quiero leer un libro", en: "No, I want to read a book" },
                { es: "mi amigo no está aquí", en: "My friend is not here" }
            ]
        },
        {
            prompt_es: "¿Qué necesitas hacer hoy?",
            prompt_en: "What do you need to do today?",
            expected_responses: [
                { es: "necesito trabajar más", en: "I need to work more" },
                { es: "necesito estudiar español", en: "I need to study Spanish" },
                { es: "quiero descansar en casa", en: "I want to rest at home" }
            ]
        },
        {
            prompt_es: "¿Tienes problemas con el autobús?",
            prompt_en: "Do you have problems with the bus?",
            expected_responses: [
                { es: "no hay problemas hoy", en: "There are no problems today" },
                { es: "sí, el autobús es lento", en: "Yes, the bus is slow" },
                { es: "quiero ir en tren", en: "I want to go by train" }
            ]
        },
        {
            prompt_es: "¿Te gusta cocinar comida caliente?",
            prompt_en: "Do you like to cook hot food?",
            expected_responses: [
                { es: "sí, cocino sopa y pollo", en: "Yes, I cook soup and chicken" },
                { es: "no, me gusta la fruta fría", en: "No, I like cold fruit" },
                { es: "quiero aprender a cocinar", en: "I want to learn to cook" }
            ]
        }
    ],
    A2: [
        {
            prompt_es: "¿Qué quieres para el desayuno?",
            prompt_en: "What do you want for breakfast?",
            expected_responses: [
                { es: "quiero huevo, pan y café", en: "I want egg, bread and coffee" },
                { es: "normalmente prefiero fruta fría", en: "Normally I prefer cold fruit" },
                { es: "un desayuno temprano, por favor", en: "An early breakfast, please" }
            ]
        },
        {
            prompt_es: "¿A qué hora es la cena hoy?",
            prompt_en: "What time is dinner today?",
            expected_responses: [
                { es: "la cena es tarde hoy", en: "Dinner is late today" },
                { es: "es en veinte minutos", en: "It is in twenty minutes" },
                { es: "quiero cocinar la cena ahora", en: "I want to cook dinner now" }
            ]
        },
        {
            prompt_es: "¿Por qué llegas tarde?",
            prompt_en: "Why are you arriving late?",
            expected_responses: [
                { es: "el autobús es lento hoy", en: "The bus is slow today" },
                { es: "porque tuve problemas con el coche", en: "Because I had problems with the car" },
                { es: "lo siento, el viaje es difícil", en: "I am sorry, the trip is difficult" }
            ]
        },
        {
            prompt_es: "¿Terminaste la tarea de la escuela?",
            prompt_en: "Did you finish the school homework?",
            expected_responses: [
                { es: "sí, ya terminé la tarea", en: "Yes, I already finished the homework" },
                { es: "todavía necesito más minutos", en: "I still need more minutes" },
                { es: "no, la tarea es muy difícil", en: "No, the homework is very difficult" }
            ]
        },
        {
            prompt_es: "¿Leíste mi mensaje anoche?",
            prompt_en: "Did you read my message last night?",
            expected_responses: [
                { es: "sí, leí su mensaje anoche", en: "Yes, I read your message last night" },
                { es: "no, olvidé ver la televisión", en: "No, I forgot to look at the television" },
                { es: "recibí la información ahora", en: "I received the information now" }
            ]
        },
        {
            prompt_es: "¿Quieres ver una película ahora?",
            prompt_en: "Do you want to watch a movie now?",
            expected_responses: [
                { es: "sí, la película es nueva", en: "Yes, the movie is new" },
                { es: "antes quiero limpiar la cocina", en: "Before I want to clean the kitchen" },
                { es: "no, es muy tarde para ver una película", en: "No, it is very late to watch a movie" }
            ]
        },
        {
            prompt_es: "¿Puedes abrir la ventana de la cocina?",
            prompt_en: "Can you open the kitchen window?",
            expected_responses: [
                { es: "sí, la cocina está muy caliente", en: "Yes, the kitchen is very hot" },
                { es: "no puedo abrir la ventana ahora", en: "I cannot open the window now" },
                { es: "la ventana está rota", en: "The window is broken" }
            ]
        },
        {
            prompt_es: "¿Quieres comprar zapatos nuevos?",
            prompt_en: "Do you want to buy new shoes?",
            expected_responses: [
                { es: "sí, necesito zapatos para el viaje", en: "Yes, I need shoes for the trip" },
                { es: "no, mis zapatos pequeños son buenos", en: "No, my small shoes are good" },
                { es: "quiero probar estos zapatos negros", en: "I want to try these black shoes" }
            ]
        },
        {
            prompt_es: "¿Cuándo viajas en avión?",
            prompt_en: "When do you travel by plane?",
            expected_responses: [
                { es: "el avión sale en quince minutos", en: "The plane leaves in fifteen minutes" },
                { es: "viajo temprano por la mañana", en: "I travel early in the morning" },
                { es: "todavía espero mi boleto de avión", en: "I am still waiting for my plane ticket" }
            ]
        },
        {
            prompt_es: "¿Vas a visitar a tus padres?",
            prompt_en: "Are you going to visit your parents?",
            expected_responses: [
                { es: "sí, voy a visitar a mis padres hoy", en: "Yes, I am going to visit my parents today" },
                { es: "a menudo los visito en su casa", en: "Often I visit them at their house" },
                { es: "no, ellos están de viaje ahora", en: "No, they are on a trip now" }
            ]
        },
        {
            prompt_es: "¿Necesitas transporte para ir al hotel?",
            prompt_en: "Do you need transport to go to the hotel?",
            expected_responses: [
                { es: "sí, necesito transporte rápido ahora", en: "Yes, I need fast transport now" },
                { es: "no, el hotel está muy cerca", en: "No, the hotel is very near" },
                { es: "prefiero conducir mi coche al hotel", en: "I prefer to drive my car to the hotel" }
            ]
        },
        {
            prompt_es: "¿Cuándo llega el tren a la estación?",
            prompt_en: "When does the train arrive at the station?",
            expected_responses: [
                { es: "el tren llega en once minutos", en: "The train arrives in eleven minutes" },
                { es: "normalmente llega temprano", en: "Normally it arrives early" },
                { es: "ya llegó a la estación", en: "It already arrived at the station" }
            ]
        },
        {
            prompt_es: "¿Quieres almorzar conmigo ahora?",
            prompt_en: "Do you want to have lunch with me now?",
            expected_responses: [
                { es: "sí, tengo mucha hambre", en: "Yes, I am very hungry" },
                { es: "antes necesito terminar mi tarea", en: "Before I need to finish my homework" },
                { es: "lo siento, es muy tarde para almorzar", en: "I am sorry, it is very late to have lunch" }
            ]
        },
        {
            prompt_es: "¿Olvidaste el mensaje anoche?",
            prompt_en: "Did you forget the message last night?",
            expected_responses: [
                { es: "sí, olvidé leer el mensaje anoche", en: "Yes, I forgot to read the message last night" },
                { es: "no, tengo la información aquí", en: "No, I have the information here" },
                { es: "no recibí su mensaje", en: "I did not receive your message" }
            ]
        },
        {
            prompt_es: "¿Cuántos minutos necesitas para estar listo?",
            prompt_en: "How many minutes do you need to be ready?",
            expected_responses: [
                { es: "necesito doce minutos más", en: "I need twelve minutes more" },
                { es: "ya estoy listo para salir", en: "I am already ready to go out" },
                { es: "espera quince minutos por favor", en: "Wait fifteen minutes please" }
            ]
        },
        {
            prompt_es: "¿Te gusta conducir de noche?",
            prompt_en: "Do you like to drive at night?",
            expected_responses: [
                { es: "no, prefiero conducir de tarde", en: "No, I prefer to drive in the afternoon" },
                { es: "a menudo conduzco temprano", en: "Often I drive early" },
                { es: "sí, la carretera está clara ahora", en: "Yes, the road is clear now" }
            ]
        },
        {
            prompt_es: "¿Qué necesitas arreglar en la casa?",
            prompt_en: "What do you need to fix in the house?",
            expected_responses: [
                { es: "necesito arreglar la ventana grande", en: "I need to fix the big window" },
                { es: "quiero arreglar la cocina hoy", en: "I want to fix the kitchen today" },
                { es: "ya arreglé la televisión nueva", en: "I already fixed the new television" }
            ]
        },
        {
            prompt_es: "¿Cuándo vas a irse del hotel?",
            prompt_en: "When are you going to leave the hotel?",
            expected_responses: [
                { es: "quiero irse temprano por la mañana", en: "I want to leave early in the morning" },
                { es: "me voy en trece minutos", en: "I am leaving in thirteen minutes" },
                { es: "todavía necesito esperar mi transporte", en: "I still need to wait for my transport" }
            ]
        },
        {
            prompt_es: "¿Cuántos boletos de autobús tienes?",
            prompt_en: "How many bus tickets do you have?",
            expected_responses: [
                { es: "tengo catorce boletos nuevos", en: "I have fourteen new tickets" },
                { es: "solo tengo doce boletos para la familia", en: "I only have twelve tickets for the family" },
                { es: "necesito comprar otra entrada", en: "I need to buy another entry" }
            ]
        },
        {
            prompt_es: "¿Quieres probar esta comida nueva?",
            prompt_en: "Do you want to try this new food?",
            expected_responses: [
                { es: "sí, me gustaría probar el filete", en: "Yes, I would like to try the steak" },
                { es: "no, prefiero mi desayuno de siempre", en: "No, I prefer my usual breakfast" },
                { es: "porque ya comí arroz con frijoles", en: "Because I already ate rice with beans" }
            ]
        },
        {
            prompt_es: "¿Tienes información sobre el viaje?",
            prompt_en: "Do you have information about the trip?",
            expected_responses: [
                { es: "sí, ya tengo la información aquí", en: "Yes, I already have the information here" },
                { es: "todavía espero el mensaje de mi amigo", en: "I am still waiting for my friend's message" },
                { es: "no, olvidé preguntar en la estación", en: "No, I forgot to ask at the station" }
            ]
        },
        {
            prompt_es: "¿A qué hora llega tu amigo?",
            prompt_en: "What time does your friend arrive?",
            expected_responses: [
                { es: "el llega en dieciséis minutos", en: "He arrives in sixteen minutes" },
                { es: "normalmente llega temprano para el almuerzo", en: "Normally he arrives early for lunch" },
                { es: "llegar tarde porque el tren es lento", en: "Arriving late because the train is slow" }
            ]
        },
        {
            prompt_es: "¿Quieres cenar en el hotel hoy?",
            prompt_en: "Do you want to have dinner at the hotel today?",
            expected_responses: [
                { es: "sí, la cena del hotel es buena", en: "Yes, the hotel dinner is good" },
                { es: "antes quiero visitar a mis padres", en: "Before I want to visit my parents" },
                { es: "no, prefiero cocinar en mi casa", en: "No, I prefer to cook at my house" }
            ]
        },
        {
            prompt_es: "¿Cuántos minutos dura la película?",
            prompt_en: "How many minutes does the movie last?",
            expected_responses: [
                { es: "la película dura veinte minutos más", en: "The movie lasts twenty minutes more" },
                { es: "terminar temprano hoy", en: "Finishing early today" },
                { es: "todavía faltan diecisiete minutos", en: "There are still seventeen minutes left" }
            ]
        },
        {
            prompt_es: "¿Limpiaste la ventana de la cocina?",
            prompt_en: "Did you clean the kitchen window?",
            expected_responses: [
                { es: "sí, la ventana está limpia ahora", en: "Yes, the window is clean now" },
                { es: "no, olvidé limpiar la cocina", en: "No, I forgot to clean the kitchen" },
                { es: "quiero arreglar la ventana antes", en: "Before, I want to fix the window" }
            ]
        },
        {
            prompt_es: "¿Cuántos zapatos nuevos tienes?",
            prompt_en: "How many new shoes do you have?",
            expected_responses: [
                { es: "tengo dieciocho zapatos en mi casa", en: "I have eighteen shoes at my house" },
                { es: "solo tengo un par nuevo", en: "I only have one new pair" },
                { es: "necesito comprar zapatos para el viaje", en: "I need to buy shoes for the trip" }
            ]
        },
        {
            prompt_es: "¿Quieres esperar el autobús aquí?",
            prompt_en: "Do you want to wait for the bus here?",
            expected_responses: [
                { es: "sí, el transporte es tarde hoy", en: "Yes, the transport is late today" },
                { es: "no, prefiero ir al aeropuerto ahora", en: "No, I prefer to go to the airport now" },
                { es: "es mejor esperar en la estación", en: "It is better to wait at the station" }
            ]
        },
        {
            prompt_es: "¿Por qué compraste catorce manzanas?",
            prompt_en: "Why did you buy fourteen apples?",
            expected_responses: [
                { es: "porque mi familia come mucha fruta", en: "Because my family eats a lot of fruit" },
                { es: "para preparar un desayuno grande", en: "To prepare a big breakfast" },
                { es: "ya olvidé por qué las compré", en: "I already forgot why I bought them" }
            ]
        },
        {
            prompt_es: "¿Te gusta viajar en avión?",
            prompt_en: "Do you like to travel by plane?",
            expected_responses: [
                { es: "sí, el viaje en avión es rápido", en: "Yes, the trip by plane is fast" },
                { es: "no, prefiero el tren o el autobús", en: "No, I prefer the train or the bus" },
                { es: "a menudo viajo por mi trabajo", en: "Often I travel for my work" }
            ]
        },
        {
            prompt_es: "¿Tienes diecinueve boletos de tren?",
            prompt_en: "Do you have nineteen train tickets?",
            expected_responses: [
                { es: "sí, tengo diecinueve boletos listos", en: "Yes, I have nineteen tickets ready" },
                { es: "no, solo tengo quince boletos", en: "No, I only have fifteen tickets" },
                { es: "necesito veinte para el grupo", en: "I need twenty for the group" }
            ]
        },
        {
            prompt_es: "¿Cuándo vas a visitar a tu familia?",
            prompt_en: "When are you going to visit your family?",
            expected_responses: [
                { es: "normalmente los visito temprano", en: "Normally I visit them early" },
                { es: "voy a ir ahora en tren", en: "I am going to go now by train" },
                { es: "mañana porque hoy tengo tarea", en: "Tomorrow because today I have homework" }
            ]
        },
        {
            prompt_es: "¿Dejaste un mensaje en mi teléfono?",
            prompt_en: "Did you leave a message on my phone?",
            expected_responses: [
                { es: "sí, envié un mensaje rápido", en: "Yes, I sent a quick message" },
                { es: "no, olvidé su información", en: "No, I forgot your information" },
                { es: "todavía no, llamo más tarde", en: "Not yet, I will call later" }
            ]
        },
        {
            prompt_es: "¿Qué película quieres ver en la televisión?",
            prompt_en: "What movie do you want to watch on TV?",
            expected_responses: [
                { es: "quiero ver una película nueva", en: "I want to watch a new movie" },
                { es: "prefiero escuchar música ahora", en: "I prefer to listen to music now" },
                { es: "cualquier película buena es perfecta", en: "Any good movie is perfect" }
            ]
        },
        {
            prompt_es: "¿Dónde compraste esos zapatos nuevos?",
            prompt_en: "Where did you buy those new shoes?",
            expected_responses: [
                { es: "los compré cerca de la estación", en: "I bought them near the station" },
                { es: "en un lugar pequeño del centro", en: "In a small place downtown" },
                { es: "ya olvidé el nombre de la tienda", en: "I already forgot the name of the store" }
            ]
        },
        {
            prompt_es: "¿Por qué abriste la ventana de la cocina?",
            prompt_en: "Why did you open the kitchen window?",
            expected_responses: [
                { es: "porque la cocina está muy caliente", en: "Because the kitchen is very hot" },
                { es: "antes de limpiar la cocina hoy", en: "Before cleaning the kitchen today" },
                { es: "para ver el jardín un minuto", en: "To see the garden for a minute" }
            ]
        },
        {
            prompt_es: "¿Tienes suficiente información para el viaje?",
            prompt_en: "Do you have enough information for the trip?",
            expected_responses: [
                { es: "sí, ya tengo la información lista", en: "Yes, I already have the information ready" },
                { es: "todavía necesito esperar el mensaje", en: "I still need to wait for the message" },
                { es: "no, la información es muy difícil", en: "No, the information is very difficult" }
            ]
        },
        {
            prompt_es: "¿Quieres cenar temprano hoy?",
            prompt_en: "Do you want to have dinner early today?",
            expected_responses: [
                { es: "sí, quiero cenar ahora por favor", en: "Yes, I want to have dinner now please" },
                { es: "no, normalmente ceno muy tarde", en: "No, normally I have dinner very late" },
                { es: "porque tengo que hacer la tarea antes", en: "Because I have to do homework before" }
            ]
        },
        {
            prompt_es: "¿Arreglaste el coche de tu padre?",
            prompt_en: "Did you fix your father's car?",
            expected_responses: [
                { es: "sí, arreglar el coche fue fácil", en: "Yes, fixing the car was easy" },
                { es: "todavía estoy arreglando el coche", en: "I am still fixing the car" },
                { es: "no, el coche está en el taller", en: "No, the car is in the repair shop" }
            ]
        },
        {
            prompt_es: "¿Cuántos minutos faltan para llegar?",
            prompt_en: "How many minutes are left to arrive?",
            expected_responses: [
                { es: "faltan quince minutos para llegar", en: "There are fifteen minutes left to arrive" },
                { es: "llegamos temprano en doce minutos", en: "We arrive early in twelve minutes" },
                { es: "el autobús llega tarde hoy", en: "The bus arrives late today" }
            ]
        },
        {
            prompt_es: "¿A menudo viajas en avión?",
            prompt_en: "Do you often travel by plane?",
            expected_responses: [
                { es: "a menudo viajo por mi trabajo", en: "Often I travel for my work" },
                { es: "no, prefiero viajar en tren rápido", en: "No, I prefer to travel by fast train" },
                { es: "ya es mi segundo viaje este año", en: "It is already my second trip this year" }
            ]
        },
        {
            prompt_es: "¿Olvidaste preparar el almuerzo hoy?",
            prompt_en: "Did you forget to prepare lunch today?",
            expected_responses: [
                { es: "sí, olvidé cocinar el almuerzo temprano", en: "Yes, I forgot to cook lunch early" },
                { es: "no, la comida está en la cocina", en: "No, the food is in the kitchen" },
                { es: "ya preparé un filete con arroz", en: "I already prepared a steak with rice" }
            ]
        },
        {
            prompt_es: "¿Quieres probar estos zapatos negros?",
            prompt_en: "Do you want to try these black shoes?",
            expected_responses: [
                { es: "sí, quiero probar los zapatos nuevos", en: "Yes, I want to try the new shoes" },
                { es: "no, mis zapatos viejos son buenos", en: "No, my old shoes are good" },
                { es: "los zapatos son pequeños para mí", en: "The shoes are small for me" }
            ]
        },
        {
            prompt_es: "¿Por qué quieres irse del hotel ahora?",
            prompt_en: "Why do you want to leave the hotel now?",
            expected_responses: [
                { es: "porque mi avión sale en una hora", en: "Because my plane leaves in an hour" },
                { es: "antes quiero visitar la estación", en: "Before I want to visit the station" },
                { es: "irse temprano es una buena idea", en: "Leaving early is a good idea" }
            ]
        },
        {
            prompt_es: "¿Tienes catorce o quince boletos?",
            prompt_en: "Do you have fourteen or fifteen tickets?",
            expected_responses: [
                { es: "tengo catorce boletos para el transporte", en: "I have fourteen tickets for the transport" },
                { es: "necesito quince boletos para la familia", en: "I need fifteen tickets for the family" },
                { es: "solo tengo once boletos hoy", en: "I only have eleven tickets today" }
            ]
        },
        {
            prompt_es: "¿Normalmente estudias después de la cena?",
            prompt_en: "Do you normally study after dinner?",
            expected_responses: [
                { es: "normalmente estudio antes de la cena", en: "Normally I study before dinner" },
                { es: "sí, estudio treinta minutos todas las noches", en: "Yes, I study thirty minutes every night" },
                { es: "no, prefiero ver una película tarde", en: "No, I prefer to watch a movie late" }
            ]
        },
        {
            prompt_es: "¿Dónde está la ventana de su cocina?",
            prompt_en: "Where is the window of your kitchen?",
            expected_responses: [
                { es: "está cerca de la puerta grande", en: "It is near the big door" },
                { es: "la ventana abre al jardín claro", en: "The window opens to the clear garden" },
                { es: "olvidé cerrar la ventana ahora", en: "I forgot to close the window now" }
            ]
        },
        {
            prompt_es: "¿Quieres desayunar temprano mañana?",
            prompt_en: "Do you want to have breakfast early tomorrow?",
            expected_responses: [
                { es: "sí, el desayuno temprano es bueno", en: "Yes, early breakfast is good" },
                { es: "no, mañana prefiero levantarser tarde", en: "No, tomorrow I prefer to get up late" },
                { es: "quiero pan, leche y fruta ahora", en: "I want bread, milk and fruit now" }
            ]
        },
        {
            prompt_es: "¿Tienes diecisiete minutos para hablar?",
            prompt_en: "Do you have seventeen minutes to talk?",
            expected_responses: [
                { es: "sí, tengo tiempo libre ahora", en: "Yes, I have free time now" },
                { es: "todavía necesito terminar mi tarea", en: "I still need to finish my homework" },
                { es: "lo siento, el transporte llega ya", en: "I am sorry, the transport is arriving already" }
            ]
        },
        {
            prompt_es: "¿Por qué no respondiste mi mensaje anoche?",
            prompt_en: "Why didn't you answer my message last night?",
            expected_responses: [
                { es: "porque ya estaba durmiendo temprano", en: "Because I was already sleeping early" },
                { es: "olvidé mi teléfono en la escuela", en: "I forgot my phone at school" },
                { es: "leí el mensaje hoy por la mañana", en: "I read the message today in the morning" }
            ]
        },
        {
            prompt_es: "¿El transporte llegó a tiempo hoy?",
            prompt_en: "Did the transport arrive on time today?",
            expected_responses: [
                { es: "sí, el autobús llegó muy temprano", en: "Yes, the bus arrived very early" },
                { es: "no, el tren llegó veinte minutos tarde", en: "No, the train arrived twenty minutes late" },
                { es: "todavía estoy esperando en la estación", en: "I am still waiting at the station" }
            ]
        }
    ],

    B1: [
        {
            prompt_es: "¿Has estado trabajando en el nuevo restaurante?",
            prompt_en: "Have you been working at the new restaurant?",
            expected_responses: [
                { es: "sí, he estado trabajando allí un mes", en: "Yes, I have been working there a month" },
                { es: "no, he estado estudiando para mejorar", en: "No, I have been studying to improve" },
                { es: "todavía no, pero quiero empezar ahora", en: "Not yet, but I want to start now" }
            ]
        },
        {
            prompt_es: "¿Qué has aprendido de las experiencias pasadas?",
            prompt_en: "What have you learned from past experiences?",
            expected_responses: [
                { es: "he aprendido a mejorar mis habilidades", en: "I have learned to improve my skills" },
                { es: "he aprendido a escuchar con atención", en: "I have learned to listen carefully" },
                { es: "todavía necesito revisar la información", en: "I still need to review the information" }
            ]
        },
        {
            prompt_es: "¿Ha traído el menú el restaurante?",
            prompt_en: "Has the restaurant brought the menu?",
            expected_responses: [
                { es: "sí, ha traído el menú a la mesa", en: "Yes, they have brought the menu to the table" },
                { es: "no, por favor trae la cuenta también", en: "No, please bring the bill too" },
                { es: "quiero entender el menú antes de comer", en: "I want to understand the menu before eating" }
            ]
        },
        {
            prompt_es: "¿Dónde has estado viviendo este mes?",
            prompt_en: "Where have you been living this month?",
            expected_responses: [
                { es: "he estado viviendo cerca del aeropuerto", en: "I have been living near the airport" },
                { es: "he estado viviendo con mi familia", en: "I have been living with my family" },
                { es: "planeamos mudarse de casa pronto", en: "We plan to move house soon" }
            ]
        },
        {
            prompt_es: "¿Han cancelado el viaje de autobús hoy?",
            prompt_en: "Have they canceled the bus trip today?",
            expected_responses: [
                { es: "sí, han cancelado el transporte por problemas", en: "Yes, they have canceled the transport due to problems" },
                { es: "no, el autobús llega en quince minutos", en: "No, the bus arrives in fifteen minutes" },
                { es: "necesito encontrar otra estación rápido", en: "I need to find another station quickly" }
            ]
        },
        {
            prompt_es: "¿Estás leyendo las noticias diarias en casa?",
            prompt_en: "Are you reading the daily news at home?",
            expected_responses: [
                { es: "sí, estoy leyendo para mejorar mi comunicación", en: "Yes, I am reading to improve my communication" },
                { es: "no, prefiero continuar mis conversaciones", en: "No, I prefer to continue my conversations" },
                { es: "olvidé revisar la información diarias", en: "I forgot to review the daily information" }
            ]
        },
        {
            prompt_es: "¿Hemos conseguido los boletos para el avión?",
            prompt_en: "Have we gotten the tickets for the plane?",
            expected_responses: [
                { es: "sí, hemos conseguido los boletos temprano", en: "Yes, we have gotten the tickets early" },
                { es: "todavía no, el transporte es difícil", en: "Not yet, the transport is difficult" },
                { es: "necesito encontrar la cuenta del viaje", en: "I need to find the bill for the trip" }
            ]
        },
        {
            prompt_es: "¿Qué estás preparando para la cena hoy?",
            prompt_en: "What are you preparing for dinner today?",
            expected_responses: [
                { es: "estoy preparando pollo con arroz y queso", en: "I am preparing chicken with rice and cheese" },
                { es: "he preparado un filete con papas fritas", en: "I have prepared a steak with french fries" },
                { es: "quiero preparar sopa mientras esperamos", en: "I want to prepare soup while we wait" }
            ]
        },
        {
            prompt_es: "¿Has entendido las conversaciones de la escuela?",
            prompt_en: "Have you understood the school conversations?",
            expected_responses: [
                { es: "sí, he entendido casi todo hoy", en: "Yes, I have understood almost everything today" },
                { es: "sin embargo necesito estudiar más", en: "However, I need to study more" },
                { es: "todavía es difícil entender rápido", en: "It is still difficult to understand fast" }
            ]
        },
        {
            prompt_es: "¿Quieres unirse a nuestro viaje este mes?",
            prompt_en: "Do you want to join our trip this month?",
            expected_responses: [
                { es: "sí, quiero unirse a su grupo hoy", en: "Yes, I want to join your group today" },
                { es: "no, tengo que trabajar durante el mes", en: "No, I have to work during the month" },
                { es: "planeamos visitar a los padres antes", en: "We plan to visit parents before" }
            ]
        },
        {
            prompt_es: "¿A qué hora hemos terminado las tareas diarias?",
            prompt_en: "What time have we finished the daily tasks?",
            expected_responses: [
                { es: "hemos terminado temprano hoy", en: "We have finished early today" },
                { es: "después de estudiar tres horas", en: "After studying for three hours" },
                { es: "todavía estamos trabajando en ellas ahora", en: "We are still working on them now" }
            ]
        },
        {
            prompt_es: "¿Por qué han cancelado su cuenta del hotel?",
            prompt_en: "Why have they canceled their hotel account?",
            expected_responses: [
                { es: "porque han cambiado su plan de viaje", en: "Because they have changed their trip plan" },
                { es: "sin embargo van a pagar la cuenta mañana", en: "However they are going to pay the bill tomorrow" },
                { es: "olvidaron revisar la información antes de irse", en: "They forgot to review the information before leaving" }
            ]
        },
        {
            prompt_es: "¿Estás estudiando para mejorar tus habilidades hoy?",
            prompt_en: "Are you studying to improve your skills today?",
            expected_responses: [
                { es: "sí, estoy estudiando para conseguir un trabajo", en: "Yes, I am studying to get a job" },
                { es: "necesito continuar mis conversaciones diarias", en: "I need to continue my daily conversations" },
                { es: "revisar mis libros me ayuda a aprender rápido", en: "Reviewing my books helps me learn fast" }
            ]
        },
        {
            prompt_es: "¿Has traído la comida del restaurante?",
            prompt_en: "Have you brought the food from the restaurant?",
            expected_responses: [
                { es: "sí, he traído pan, sopa y queso", en: "Yes, I have brought bread, soup and cheese" },
                { es: "no, el restaurante está cerrado ahora", en: "No, the restaurant is closed now" },
                { es: "traer la comida es difícil sin transporte", en: "Bringing the food is difficult without transport" }
            ]
        },
        {
            prompt_es: "¿Dónde podemos encontrar un buen menú hoy?",
            prompt_en: "Where can we find a good menu today?",
            expected_responses: [
                { es: "podemos encontrar un menú en el hotel", en: "We can find a menu at the hotel" },
                { es: "mientras caminamos podemos buscar un restaurante", en: "While we walk we can look for a restaurant" },
                { es: "ya tengo el menú de la cocina aquí", en: "I already have the kitchen menu here" }
            ]
        },
        {
            prompt_es: "¿Cuánto tiempo has estado viviendo en esta casa?",
            prompt_en: "How much time have you been living in this house?",
            expected_responses: [
                { es: "he estado viviendo aquí durante dos años", en: "I have been living here for two years" },
                { es: "hemos vivido aquí un mes solamente", en: "We have lived here one month only" },
                { es: "después de este mes quiero mudarse", en: "After this month I want to move" }
            ]
        },
        {
            prompt_es: "¿Qué estás leyendo sobre las experiencias pasadas?",
            prompt_en: "What are you reading about past experiences?",
            expected_responses: [
                { es: "estoy leyendo un libro sobre comunicación", en: "I am reading a book about communication" },
                { es: "ha sido un viaje largo y difícil", en: "It has been a long and difficult trip" },
                { es: "quiero entender su problemas antes de seguir", en: "I want to understand their problems before following" }
            ]
        },
        {
            prompt_es: "¿Quieres planear un nuevo viaje conmigo?",
            prompt_en: "Do you want to plan a new trip with me?",
            expected_responses: [
                { es: "sí, quiero planear un viaje en avión", en: "Yes, I want to plan a trip by plane" },
                { es: "durante este mes no tengo tiempo libre", en: "During this month I do not have free time" },
                { es: "sin embargo podemos hablar de eso después", en: "However we can talk about that later" }
            ]
        },
        {
            prompt_es: "¿Has conseguido revisar la información del tren?",
            prompt_en: "Have you managed to review the train information?",
            expected_responses: [
                { es: "sí, he revisado todo en la estación", en: "Yes, I have reviewed everything at the station" },
                { es: "todavía no, el mensaje no llegó", en: "Not yet, the message did not arrive" },
                { es: "necesito encontrar mi boleto de tren antes", en: "I need to find my train ticket before" }
            ]
        },
        {
            prompt_es: "¿Por qué has decidido mudarse de casa este año?",
            prompt_en: "Why have you decided to move house this year?",
            expected_responses: [
                { es: "porque mi nueva casa está cerca del trabajo", en: "Because my new house is near work" },
                { es: "para vivir con mi familia otra vez", en: "To live with my family again" },
                { es: "he estado viviendo en un lugar muy pequeño", en: "I have been living in a very small place" }
            ]
        },
        {
            prompt_es: "¿Has pagado la cuenta en el restaurante?",
            prompt_en: "Have you paid the bill at the restaurant?",
            expected_responses: [
                { es: "sí, ya he pagado la cuenta con dinero", en: "Yes, I have already paid the bill with money" },
                { es: "no, todavía espero que traigan la cuenta", en: "No, I am still waiting for them to bring the bill" },
                { es: "mi amigo ha pagado todo hoy", en: "My friend has paid for everything today" }
            ]
        },
        {
            prompt_es: "¿Estás trabajando para mejorar tus habilidades diarias?",
            prompt_en: "Are you working to improve your daily skills?",
            expected_responses: [
                { es: "sí, estoy trabajando duro cada hora", en: "Yes, I am working hard every hour" },
                { es: "quiero continuar aprendiendo más cosas", en: "I want to continue learning more things" },
                { es: "revisar mi tarea me ayuda a mejorar", en: "Reviewing my homework helps me improve" }
            ]
        },
        {
            prompt_es: "¿Ha preparado ella la comida para el viaje?",
            prompt_en: "Has she prepared the food for the trip?",
            expected_responses: [
                { es: "sí, ha preparado pan, queso y fruta", en: "Yes, she has prepared bread, cheese and fruit" },
                { es: "está preparando la comida en la cocina ahora", en: "She is preparing the food in the kitchen now" },
                { es: "no, olvidó preparar las cosas diarias", en: "No, she forgot to prepare the daily things" }
            ]
        },
        {
            prompt_es: "¿Dónde han estado estudiando tus hermanos este mes?",
            prompt_en: "Where have your brothers been studying this month?",
            expected_responses: [
                { es: "han estado estudiando en la escuela grande", en: "They have been studying at the big school" },
                { es: "hemos estado estudiando juntos en casa", en: "We have been studying together at home" },
                { es: "ellos quieren continuar estudiando en el hotel", en: "They want to continue studying at the hotel" }
            ]
        },
        {
            prompt_es: "¿Quieres leer su mensaje mientras esperamos el tren?",
            prompt_en: "Do you want to read his message while we wait for the train?",
            expected_responses: [
                { es: "sí, quiero leer el mensaje ahora", en: "Yes, I want to read the message now" },
                { es: "no, prefiero escuchar música en mi televisión", en: "No, I prefer to listen to music on my television" },
                { es: "necesito revisar la información del transporte antes", en: "I need to review the transport information before" }
            ]
        },
        {
            prompt_es: "¿Has conseguido encontrar un lugar cerca de la estación?",
            prompt_en: "Have you managed to find a place near the station?",
            expected_responses: [
                { es: "sí, he encontrado una casa pequeña muy cerca", en: "Yes, I have found a small house very near" },
                { es: "todavía estoy buscando con mi amigo", en: "I am still looking with my friend" },
                { es: "es difícil encontrar un lugar rápido hoy", en: "It is difficult to find a place quickly today" }
            ]
        },
        {
            prompt_es: "¿Por qué has cancelado tus conversaciones de hoy?",
            prompt_en: "Why have you canceled your conversations today?",
            expected_responses: [
                { es: "porque he estado muy cansado este mes", en: "Because I have been very tired this month" },
                { es: "necesito preparar mi viaje de avión antes", en: "I need to prepare my plane trip before" },
                { es: "sin embargo podemos hablar después de cenar", en: "However we can talk after having dinner" }
            ]
        },
        {
            prompt_es: "¿Qué ha dicho su familia sobre la mudanza?",
            prompt_en: "What has his family said about the move?",
            expected_responses: [
                { es: "ellos quieren mudarse el próximo mes", en: "They want to move next month" },
                { es: "están felices con el cambio de lugar", en: "They are happy with the change of place" },
                { es: "todavía tienen problemas para empaquetar", en: "They still have problems packing" }
            ]
        },
        {
            prompt_es: "¿Estás viviendo con tus padres este año?",
            prompt_en: "Are you living with your parents this year?",
            expected_responses: [
                { es: "sí, he estado viviendo con ellos cinco meses", en: "Yes, I have been working/living with them for five months" },
                { es: "no, prefiero vivir solo en la ciudad", en: "No, I prefer to live alone in the city" },
                { es: "quiero mudarse a otra casa pronto", en: "I want to move to another house soon" }
            ]
        },
        {
            prompt_es: "¿Has revisado el menú del nuevo restaurante?",
            prompt_en: "Have you reviewed the menu of the new restaurant?",
            expected_responses: [
                { es: "sí, el menú tiene filete, pollo y pescado", en: "Yes, the menu has steak, chicken and fish" },
                { es: "no, olvidé mirar el menú antes", en: "No, I forgot to look at the menu before" },
                { es: "quiero entender sus precios primero", en: "I want to understand their prices first" }
            ]
        },
        {
            prompt_es: "¿Has continuado estudiando durante el viaje?",
            prompt_en: "Have you continued studying during the trip?",
            expected_responses: [
                { es: "sí, he estado estudiando libros diarios", en: "Yes, I have been studying daily books" },
                { es: "no, he estado descansando y viendo películas", en: "No, I have been resting and watching movies" },
                { es: "mientras viajo es difícil estudiar más", en: "While I travel it is difficult to study more" }
            ]
        },
        {
            prompt_es: "¿Han traído los padres su coche nuevo?",
            prompt_en: "Have the parents brought their new car?",
            expected_responses: [
                { es: "sí, han traído el coche grande hoy", en: "Yes, they have brought the big car today" },
                { es: "no, el coche está arreglando en casa", en: "No, the car is fixing at home" },
                { es: "ellos quieren viajar en tren hoy", en: "They want to travel by train today" }
            ]
        },
        {
            prompt_es: "¿Quieres seguir las instrucciones del menú?",
            prompt_en: "Do you want to follow the menu instructions?",
            expected_responses: [
                { es: "sí, para preparar la sopa de pescado", en: "Yes, to prepare the fish soup" },
                { es: "no, quiero cocinar pollo con ensalada", en: "No, I want to cook chicken with salad" },
                { es: "necesito entender la información antes", en: "I need to understand the information before" }
            ]
        },
        {
            prompt_es: "¿Has conseguido la cuenta del transporte?",
            prompt_en: "Have you gotten the transport bill?",
            expected_responses: [
                { es: "sí, he conseguido la cuenta de la estación", en: "Yes, I have gotten the bill from the station" },
                { es: "todavía no, el mensaje no llegó", en: "Not yet, the message did not arrive" },
                { es: "mi amigo tiene el boleto y la cuenta", en: "My friend has the ticket and the bill" }
            ]
        },
        {
            prompt_es: "¿Por qué has estado leyendo sobre este lugar?",
            prompt_en: "Why have you been reading about this place?",
            expected_responses: [
                { es: "porque planeo visitar el hotel pronto", en: "Because I plan to visit the hotel soon" },
                { es: "para entender su cultura y comida buena", en: "To understand its culture and good food" },
                { es: "sin embargo solo leo por placer hoy", en: "However I only read for pleasure today" }
            ]
        },
        {
            prompt_es: "¿Han estado viviendo en este hotel cinco años?",
            prompt_en: "Have they been living in this hotel for five years?",
            expected_responses: [
                { es: "no, han estado viviendo aquí un mes", en: "No, they have been living here a month" },
                { es: "sí, han estado viviendo aquí muchos años", en: "Yes, they have been living here many years" },
                { es: "quieren mudarse de casa después de este mes", en: "They want to move house after this month" }
            ]
        },
        {
            prompt_es: "¿Quieres revisar tu tarea después de comer?",
            prompt_en: "Do you want to review your homework after eating?",
            expected_responses: [
                { es: "sí, necesito revisar todo hoy", en: "Yes, I need to review everything today" },
                { es: "no, prefiero escuchar música y descansar", en: "No, I prefer to listen to music and rest" },
                { es: "ya revisé las tareas diarias temprano", en: "I already reviewed the daily tasks early" }
            ]
        },
        {
            prompt_es: "¿Has estado trabajando para mejorar tu comunicación?",
            prompt_en: "Have you been working to improve your communication?",
            expected_responses: [
                { es: "sí, he estado teniendo muchas conversaciones", en: "Yes, I have been having many conversations" },
                { es: "quiero conseguir mejores habilidades este año", en: "I want to get better skills this year" },
                { es: "todavía es difícil hablar rápido con amigos", en: "It is still difficult to talk fast with friends" }
            ]
        },
        {
            prompt_es: "¿Qué has traído para el desayuno de hoy?",
            prompt_en: "What have you brought for today's breakfast?",
            expected_responses: [
                { es: "he traído pan caliente, leche y fruta", en: "I have brought hot bread, milk and fruit" },
                { es: "no he traído nada de la cocina", en: "I have not brought anything from the kitchen" },
                { es: "mi hermana ha preparado huevos con queso", en: "My sister has prepared eggs with cheese" }
            ]
        },
        {
            prompt_es: "¿Han conseguido entender sus problemas?",
            prompt_en: "Have they managed to understand their problems?",
            expected_responses: [
                { es: "sí, han conversado durante una hora", en: "Yes, they have conversed for an hour" },
                { es: "sin embargo necesitan cambiar su estrategia", en: "However they need to change their strategy" },
                { es: "todavía no, es una situación difícil", en: "Not yet, it is a difficult situation" }
            ]
        },
        {
            prompt_es: "¿Has planeado cancelar tu viaje en avión?",
            prompt_en: "Have you planned to cancel your plane trip?",
            expected_responses: [
                { es: "sí, he tenido que cancelar el viaje hoy", en: "Yes, I have had to cancel the trip today" },
                { es: "no, quiero ir al hotel este mes", en: "No, I want to go to the hotel this month" },
                { es: "todavía no, espero revisar la información antes", en: "Not yet, I hope to review the information before" }
            ]
        },
        {
            prompt_es: "¿Qué habilidades has aprendido en tu nuevo trabajo?",
            prompt_en: "What skills have you learned in your new job?",
            expected_responses: [
                { es: "he aprendido a mejorar mi comunicación diaria", en: "I have learned to improve my daily communication" },
                { es: "he estado aprendiendo a preparar comida", en: "I have been learning to prepare food" },
                { es: "todavía necesito continuar aprendiendo más", en: "I still need to continue learning more" }
            ]
        },
        {
            prompt_es: "¿Han estado leyendo sus libros durante la tarde?",
            prompt_en: "Have they been reading their books during the afternoon?",
            expected_responses: [
                { es: "sí, han estado leyendo sobre experiencias pasadas", en: "Yes, they have been reading about past experiences" },
                { es: "no, prefieren escuchar música o ver televisión", en: "No, they prefer to listen to music or watch TV" },
                { es: "mientras ellos descansan yo cocino la cena", en: "While they rest I cook dinner" }
            ]
        },
        {
            prompt_es: "¿Quieres continuar la conversación en el restaurante?",
            prompt_en: "Do you want to continue the conversation at the restaurant?",
            expected_responses: [
                { es: "sí, podemos pedir el menú y almorzar", en: "Yes, we can ask for the menu and have lunch" },
                { es: "no, prefiero ir a casa a descansar ahora", en: "No, I prefer to go home to rest now" },
                { es: "después de revisar la cuenta del hotel podemos ir", en: "After reviewing the hotel bill we can go" }
            ]
        },
        {
            prompt_es: "¿Ha conseguido tu hermano un nuevo lugar para vivir?",
            prompt_en: "Has your brother gotten a new place to live?",
            expected_responses: [
                { es: "sí, ha encontrado una casa pequeña muy buena", en: "Yes, he has found a very good small house" },
                { es: "todavía está viviendo con sus padres este mes", en: "He is still living with his parents this month" },
                { es: "quiere mudarse de casa después de este año", en: "He wants to move house after this year" }
            ]
        },
        {
            prompt_es: "¿Qué has estado preparando durante el mes?",
            prompt_en: "What have you been preparing during the month?",
            expected_responses: [
                { es: "he estado preparando mi viaje de avión", en: "I have been preparing my plane trip" },
                { es: "he preparado un nuevo plan para el trabajo", en: "I have prepared a new plan for work" },
                { es: "necesito preparar las tareas de la escuela", en: "I need to prepare the school homework" }
            ]
        },
        {
            prompt_es: "¿Has intentado seguir sus conversaciones diarias?",
            prompt_en: "Have you tried to follow their daily conversations?",
            expected_responses: [
                { es: "sí, pero hablan muy rápido en el restaurante", en: "Yes, but they talk very fast at the restaurant" },
                { es: "me ayuda a entender y mejorar mis habilidades", en: "It helps me understand and improve my skills" },
                { es: "sin embargo prefiero leer libros en casa", en: "However I prefer to read books at home" }
            ]
        },
        {
            prompt_es: "¿Por qué has traído a tu amigo a mi casa?",
            prompt_en: "Why have you brought your friend to my house?",
            expected_responses: [
                { es: "porque queremos estudiar y hacer la tarea juntos", en: "Because we want to study and do homework together" },
                { es: "para tener una conversación sobre las vacaciones", en: "To have a conversation about the vacation" },
                { es: "el quiere conocer a mi familia hoy", en: "He wants to meet my family today" }
            ]
        },
        {
            prompt_es: "¿Han conseguido revisar la cuenta del restaurante?",
            prompt_en: "Have they managed to review the restaurant bill?",
            expected_responses: [
                { es: "sí, han revisado la cuenta antes de pagar", en: "Yes, they have reviewed the bill before paying" },
                { es: "todavía no, la cuenta tiene problemas hoy", en: "Not yet, the bill has problems today" },
                { es: "mi padre ha pagado la cuenta del almuerzo ya", en: "My father has already paid the lunch bill" }
            ]
        },
        {
            prompt_es: "¿Quieres unirse a nosotros para cenar después?",
            prompt_en: "Do you want to join us for dinner later?",
            expected_responses: [
                { es: "sí, quiero unirse a su mesa después de trabajar", en: "Yes, I want to join your table after working" },
                { es: "lo siento, ya comí pescado en mi casa", en: "I am sorry, I already ate fish at my house" },
                { es: "mientras tenga que estudiar no puedo salir", en: "As long as I have to study I cannot go out" }
            ]
        }
    ],
    B2: [
        {
            prompt_es: "¿Cómo planeas optimizar el nuevo proceso del sistema?",
            prompt_en: "How do you plan to optimize the new system process?",
            expected_responses: [
                { es: "necesitamos analizar el rendimiento cuidadosamente", en: "We need to analyze the performance carefully" },
                { es: "con una estrategia efectiva podemos lograr resultados", en: "With an effective strategy we can achieve results" },
                { es: "aunque es complicado, podemos actualizar el enfoque", en: "Although it is complicated, we can update the approach" }
            ]
        },
        {
            prompt_es: "¿Has evaluado los riesgos de esta estrategia profesional?",
            prompt_en: "Have you evaluated the risks of this professional strategy?",
            expected_responses: [
                { es: "sí, he evaluado cada riesgo posible", en: "Yes, I have evaluated every possible risk" },
                { es: "por lo tanto es necesario cambiar el enfoque", en: "Therefore it is necessary to change the approach" },
                { es: "existe una posibilidad de tener problemas", en: "There is a possibility of having problems" }
            ]
        },
        {
            prompt_es: "¿Qué resultados han analizado en la reunión?",
            prompt_en: "What results have they analyzed in the meeting?",
            expected_responses: [
                { es: "han analizado un rendimiento muy positivo", en: "They have analyzed a very positive performance" },
                { es: "además han optimizado el concepto de trabajo", en: "In addition they have optimized the concept of work" },
                { es: "los resultados muestran que el sistema funciona", en: "The results show that the system works" }
            ]
        },
        {
            prompt_es: "¿Cómo podemos coordinar esta situación complicada?",
            prompt_en: "How can we coordinate this complicated situation?",
            expected_responses: [
                { es: "debemos coordinar los pasos cuidadosamente", en: "We must coordinate the steps carefully" },
                { es: "a pesar de los problemas, el enfoque es realista", en: "Despite the problems, the approach is realistic" },
                { es: "quiero discutir una nueva estrategia hoy", en: "I want to discuss a new strategy today" }
            ]
        },
        {
            prompt_es: "¿Has aclarado las expectativas para el futuro viaje?",
            prompt_en: "Have you clarified the expectations for the future trip?",
            expected_responses: [
                { es: "sí, he aclarado todo con mis padres", en: "Yes, I have clarified everything with my parents" },
                { es: "aunque es a largo plazo, el plan es bueno", en: "Although it is long term, the plan is good" },
                { es: "todavía necesito explorar un lugar remoto", en: "I still need to explore a remote place" }
            ]
        },
        {
            prompt_es: "¿Por qué han insistido en actualizar el sistema?",
            prompt_en: "Why have they insisted on updating the system?",
            expected_responses: [
                { es: "para aumentar la comunicación en la sociedad", en: "To increase communication in society" },
                { es: "han insistido porque la estrategia ha cambiado", en: "They have insisted because the strategy has changed" },
                { es: "incluso con problemas, es necesario avanzar", en: "Even with problems, it is necessary to move forward" }
            ]
        },
        {
            prompt_es: "¿Qué motivación necesitas para lograr tus metas?",
            prompt_en: "What motivation do you need to achieve your goals?",
            expected_responses: [
                { es: "mi familia es mi mayor motivación", en: "My family is my biggest motivation" },
                { es: "necesito fortalecer mis habilidades profesionales", en: "I need to strengthen my professional skills" },
                { es: "un enfoque positivo ayuda a cambiar la situación", en: "A positive approach helps to change the situation" }
            ]
        },
        {
            prompt_es: "¿Cómo se adapta tu cultura a estos desafíos?",
            prompt_en: "How does your culture adapt to these challenges?",
            expected_responses: [
                { es: "nuestra sociedad sabe adaptarse a los cambios", en: "Our society knows how to adapt to changes" },
                { es: "es un proceso complicado pero positivo", en: "It is a complicated but positive process" },
                { es: "discutir los desafíos ayuda a fortalecer la cultura", en: "Discussing challenges helps to strengthen culture" }
            ]
        },
        {
            prompt_es: "¿Has explorado la posibilidad de reducir el riesgo?",
            prompt_en: "Have you explored the possibility of reducing the risk?",
            expected_responses: [
                { es: "sí, he explorado una estrategia más realista", en: "Yes, I have explored a more realistic strategy" },
                { es: "por lo tanto hemos reducido el riesgo hoy", en: "Therefore we have reduced the risk today" },
                { es: "todavía es necesario analizar el concepto", en: "It is still necessary to analyze the concept" }
            ]
        },
        {
            prompt_es: "¿Es posible lograr un rendimiento efectivo ahora?",
            prompt_en: "Is it possible to achieve an effective performance now?",
            expected_responses: [
                { es: "sí, con un sistema innovadora es posible", en: "Yes, with an innovative system it is possible" },
                { es: "hemos optimizado el enfoque para lograrlo", en: "We have optimized the approach to achieve it" },
                { es: "sin embargo la situación actual es difícil", en: "However the current situation is difficult" }
            ]
        },

        {
            prompt_es: "¿Han discutido la nueva estrategia de comunicación?",
            prompt_en: "Have they discussed the new communication strategy?",
            expected_responses: [
                { es: "sí, han discutido la estrategia cuidadosamente", en: "Yes, they have discussed the strategy carefully" },
                { es: "además han aclarado todas las expectativas", en: "In addition they have clarified all expectations" },
                { es: "por lo tanto el proceso es más claro hoy", en: "Therefore the process is clearer today" }
            ]
        },
        {
            prompt_es: "¿Es necesario cambiar el enfoque a largo plazo?",
            prompt_en: "Is it necessary to change the long term approach?",
            expected_responses: [
                { es: "sí, un enfoque realista es necesario hoy", en: "Yes, a realistic approach is necessary today" },
                { es: "a pesar de los resultados, prefiero esperar", en: "Despite the results, I prefer to wait" },
                { es: "aunque es difícil, el futuro es positivo", en: "Although it is difficult, the future is positive" }
            ]
        },
        {
            prompt_es: "¿Has actualizado la información sobre el sistema?",
            prompt_en: "Have you updated the system information?",
            expected_responses: [
                { es: "sí, he actualizado la información hoy", en: "Yes, I have updated the information today" },
                { es: "necesito optimizar el proceso antes de cambiar", en: "I need to optimize the process before changing" },
                { es: "incluso sin ayuda, logré actualizar todo", en: "Even without help, I achieved updating everything" }
            ]
        },
        {
            prompt_es: "¿Qué desafíos tiene nuestra sociedad actual?",
            prompt_en: "What challenges does our current society have?",
            expected_responses: [
                { es: "debemos fortalecer la cultura y la educación", en: "We must strengthen culture and education" },
                { es: "la situación es un proceso complicado", en: "The situation is a complicated process" },
                { es: "por lo tanto la motivación es muy necesaria", en: "Therefore motivation is very necessary" }
            ]
        },
        {
            prompt_es: "¿Han evaluado el rendimiento del transporte?",
            prompt_en: "Have they evaluated the transport performance?",
            expected_responses: [
                { es: "sí, han evaluado el sistema de trenes", en: "Yes, they have evaluated the train system" },
                { es: "el rendimiento ha sido reducido este mes", en: "The performance has been reduced this month" },
                { es: "es posible coordinar un mejor transporte", en: "It is possible to coordinate better transport" }
            ]
        },
        {
            prompt_es: "¿Cómo lograste coordinar la reunión del restaurante?",
            prompt_en: "How did you manage to coordinate the restaurant meeting?",
            expected_responses: [
                { es: "coordinar la reunión fue un proceso fácil", en: "Coordinating the meeting was an easy process" },
                { es: "discutido el menú antes, todo fue rápido", en: "Having discussed the menu before, everything was fast" },
                { es: "traer la cuenta a tiempo ayudó mucho", en: "Bringing the bill on time helped a lot" }
            ]
        },
        {
            prompt_es: "¿Has analizado la posibilidad de un viaje remoto?",
            prompt_en: "Have you analyzed the possibility of a remote trip?",
            expected_responses: [
                { es: "sí, es una posibilidad a largo plazo", en: "Yes, it is a long-term possibility" },
                { es: "quiero explorar un lugar remoto en el futuro", en: "I want to explore a remote place in the future" },
                { es: "a pesar de los riesgos, el viaje es positivo", en: "Despite the risks, the trip is positive" }
            ]
        },
        {
            prompt_es: "¿Por qué has insistido en una estrategia innovadora?",
            prompt_en: "Why have you insisted on an innovative strategy?",
            expected_responses: [
                { es: "porque queremos optimizar los resultados", en: "Because we want to optimize the results" },
                { es: "una estrategia innovadora fortalece el trabajo", en: "An innovative strategy strengthens work" },
                { es: "aunque es complicado, ayuda a aumentar el rendimiento", en: "Although it is complicated, it helps to increase performance" }
            ]
        },
        {
            prompt_es: "¿Has aclarado el concepto de riesgo con tu equipo?",
            prompt_en: "Have you clarified the risk concept with your team?",
            expected_responses: [
                { es: "sí, el concepto ha sido aclarado hoy", en: "Yes, the concept has been clarified today" },
                { es: "por lo tanto todos entienden la situación", en: "Therefore everyone understands the situation" },
                { es: "todavía necesitamos evaluar algunas cosas", en: "We still need to evaluate some things" }
            ]
        },
        {
            prompt_es: "¿Es realista esperar un cambio positivo ahora?",
            prompt_en: "Is it realistic to expect a positive change now?",
            expected_responses: [
                { es: "sí, con un enfoque profesional es realista", en: "Yes, with a professional approach it is realistic" },
                { es: "hemos ampliado la estrategia para lograrlo", en: "We have expanded the strategy to achieve it" },
                { es: "sin embargo la situación es muy difícil", en: "However the situation is very difficult" }
            ]
        },
        {
            prompt_es: "¿Has logrado adaptar la estrategia para mejorar el proceso?",
            prompt_en: "Have you achieved adapting the strategy to improve the process?",
            expected_responses: [
                { es: "sí, me he adaptado a la nueva situación", en: "Yes, I have adapted to the new situation" },
                { es: "hemos optimizado el rendimiento del sistema", en: "We have optimized the system performance" },
                { es: "por lo tanto los resultados son muy positivos", en: "Therefore the results are very positive" }
            ]
        },
        {
            prompt_es: "¿Qué expectativas tienes sobre la cultura de la sociedad?",
            prompt_en: "What expectations do you have about the culture of society?",
            expected_responses: [
                { es: "quiero entender su sociedad y cultura mejor", en: "I want to understand their society and culture better" },
                { es: "además tengo altas expectativas para el futuro", en: "In addition I have high expectations for the future" },
                { es: "es un proceso necesario para fortalecer la unión", en: "It is a necessary process to strengthen the union" }
            ]
        },
        {
            prompt_es: "¿Han analizado los riesgos del enfoque actual?",
            prompt_en: "Have they analyzed the risks of the current approach?",
            expected_responses: [
                { es: "sí, han analizado cada riesgo cuidadosamente", en: "Yes, they have analyzed every risk carefully" },
                { es: "aunque es complicado, el enfoque es realista", en: "Although it is complicated, the approach is realistic" },
                { es: "por lo tanto prefieren cambiar la estrategia hoy", en: "Therefore they prefer to change the strategy today" }
            ]
        },
        {
            prompt_es: "¿Por qué has insistido en evaluar el rendimiento otra vez?",
            prompt_en: "Why have you insisted on evaluating the performance again?",
            expected_responses: [
                { es: "porque los resultados pasados no fueron buenos", en: "Because past results were not good" },
                { es: "necesitamos evaluar todo para optimizar el sistema", en: "We need to evaluate everything to optimize the system" },
                { es: "incluso con problemas, prefiero revisar la información", en: "Even with problems, I prefer to review the information" }
            ]
        },
        {
            prompt_es: "¿Es posible coordinar el transporte a largo plazo?",
            prompt_en: "Is it possible to coordinate long term transport?",
            expected_responses: [
                { es: "sí, es una posibilidad que estamos explorando", en: "Yes, it is a possibility that we are exploring" },
                { es: "a pesar de los desafíos, podemos lograrlo hoy", en: "Despite the challenges, we can achieve it today" },
                { es: "necesitamos coordinar con el aeropuerto antes", en: "We need to coordinate with the airport before" }
            ]
        },
        {
            prompt_es: "¿Has aclarado el concepto innovadora con tu familia?",
            prompt_en: "Have you clarified the innovative concept with your family?",
            expected_responses: [
                { es: "sí, el concepto ha sido aclarado en casa", en: "Yes, the concept has been clarified at home" },
                { es: "ellos tienen una motivación muy positiva hoy", en: "They have a very positive motivation today" },
                { es: "aunque es difícil de entender, les gusta", en: "Although it is difficult to understand, they like it" }
            ]
        },
        {
            prompt_es: "¿Cómo podemos fortalecer la estrategia profesional?",
            prompt_en: "How can we strengthen the professional strategy?",
            expected_responses: [
                { es: "debemos actualizar el sistema y las habilidades", en: "We must update the system and the skills" },
                { es: "además es necesario aumentar la comunicación", en: "In addition it is necessary to increase communication" },
                { es: "un enfoque profesional ayuda a reducir riesgos", en: "A professional approach helps to reduce risks" }
            ]
        },
        {
            prompt_es: "¿Han explorado un lugar remoto durante su viaje?",
            prompt_en: "Have they explored a remote place during their trip?",
            expected_responses: [
                { es: "sí, han explorado un lugar muy remoto", en: "Yes, they have explored a very remote place" },
                { es: "su viaje a largo plazo ha sido positivo", en: "Their long term trip has been positive" },
                { es: "sin embargo fue un proceso complicado llegar allí", en: "However it was a complicated process to get there" }
            ]
        },
        {
            prompt_es: "¿Por lo tanto has decidido actualizar la información?",
            prompt_en: "Therefore have you decided to update the information?",
            expected_responses: [
                { es: "sí, he actualizado los resultados del proceso", en: "Yes, I have updated the process results" },
                { es: "ya he analizado la situación cuidadosamente", en: "I have already analyzed the situation carefully" },
                { es: "todavía necesito discutir esto con mi amigo", en: "I still need to discuss this with my friend" }
            ]
        },
        {
            prompt_es: "¿Es complicado lograr un enfoque realista hoy?",
            prompt_en: "Is it complicated to achieve a realistic approach today?",
            expected_responses: [
                { es: "sí, la situación actual es muy complicada", en: "Yes, the current situation is very complicated" },
                { es: "aunque es difícil, con trabajo es posible", en: "Although it is difficult, with work it is possible" },
                { es: "hemos ampliado la estrategia para lograr resultados", en: "We have expanded the strategy to achieve results" }
            ]
        },
        {
            prompt_es: "¿Has logrado optimizar el rendimiento del restaurante?",
            prompt_en: "Have you achieved optimizing the performance of the restaurant?",
            expected_responses: [
                { es: "sí, hemos optimizado el proceso de la cocina", en: "Yes, we have optimized the kitchen process" },
                { es: "por lo tanto los resultados son muy positivos hoy", en: "Therefore the results are very positive today" },
                { es: "aunque fue complicado, logramos cambiar el enfoque", en: "Although it was complicated, we achieved changing the approach" }
            ]
        },
        {
            prompt_es: "¿Qué estrategia profesional tienes para el futuro?",
            prompt_en: "What professional strategy do you have for the future?",
            expected_responses: [
                { es: "planeo fortalecer mis habilidades a largo plazo", en: "I plan to strengthen my skills long term" },
                { es: "además quiero explorar un enfoque innovadora", en: "In addition I want to explore an innovative approach" },
                { es: "mi estrategia es reducir el riesgo del proceso", en: "My strategy is to reduce the risk of the process" }
            ]
        },
        {
            prompt_es: "¿Han coordinado la información de la mudanza?",
            prompt_en: "Have they coordinated the information of the move?",
            expected_responses: [
                { es: "sí, la situación ha sido coordinada cuidadosamente", en: "Yes, the situation has been coordinated carefully" },
                { es: "hemos actualizado los planes de viaje hoy", en: "We have updated the trip plans today" },
                { es: "incluso con problemas, es posible mudarse pronto", en: "Even with problems, it is possible to move soon" }
            ]
        },
        {
            prompt_es: "¿Por qué has discutido los desafíos con la familia?",
            prompt_en: "Why have you discussed the challenges with the family?",
            expected_responses: [
                { es: "porque sus expectativas son muy altas", en: "Because their expectations are very high" },
                { es: "discutir los problemas ayuda a la motivación", en: "Discussing the problems helps motivation" },
                { es: "queremos adaptarse juntos a la nueva situación", en: "We want to adapt together to the new situation" }
            ]
        },
        {
            prompt_es: "¿Es necesario evaluar el sistema de transporte?",
            prompt_en: "Is it necessary to evaluate the transport system?",
            expected_responses: [
                { es: "sí, para reducir el riesgo en la estación", en: "Yes, to reduce the risk at the station" },
                { es: "hemos evaluado el rendimiento del autobús antes", en: "We have evaluated the bus performance before" },
                { es: "por lo tanto un enfoque realista es posible hoy", en: "Therefore a realistic approach is possible today" }
            ]
        },
        {
            prompt_es: "¿Has aclarado el concepto de sociedad con tus amigos?",
            prompt_en: "Have you clarified the concept of society with your friends?",
            expected_responses: [
                { es: "sí, hemos analizado su cultura cuidadosamente", en: "Yes, we have analyzed its culture carefully" },
                { es: "es un concepto complicado pero muy positivo", en: "It is a complicated but very positive concept" },
                { es: "además ayuda a entender las experiencias pasadas", en: "In addition it helps to understand past experiences" }
            ]
        },
        {
            prompt_es: "¿Han aumentado los resultados de tu trabajo?",
            prompt_en: "Have the results of your work increased?",
            expected_responses: [
                { es: "sí, he logrado aumentar mi rendimiento este mes", en: "Yes, I have achieved increasing my performance this month" },
                { es: "con una estrategia efectiva todo es posible", en: "With an effective strategy everything is possible" },
                { es: "sin embargo la situación actual es difícil", en: "However the current situation is difficult" }
            ]
        },
        {
            prompt_es: "¿Cómo podemos lograr un enfoque realista para el viaje?",
            prompt_en: "How can we achieve a realistic approach for the trip?",
            expected_responses: [
                { es: "debemos planear los pasos del viaje antes", en: "We must plan the trip steps before" },
                { es: "a pesar de la distancia, es un lugar remoto bueno", en: "Despite the distance, it is a good remote place" },
                { es: "aunque es a largo plazo, el plan es efectivo", en: "Although it is long term, the plan is effective" }
            ]
        },
        {
            prompt_es: "¿Por qué has argumentado que el riesgo es alto?",
            prompt_en: "Why have you argued that the risk is high?",
            expected_responses: [
                { es: "porque ya he evaluado la situación otra vez", en: "Because I have already evaluated the situation again" },
                { es: "el proceso actual tiene muchos desafíos", en: "The current process has many challenges" },
                { es: "por lo tanto es necesario cambiar la estrategia", en: "Therefore it is necessary to change the strategy" }
            ]
        },
        {
            prompt_es: "¿Has explorado un sistema más innovadora este año?",
            prompt_en: "Have you explored a more innovative system this year?",
            expected_responses: [
                { es: "sí, he explorado un sistema profesional nuevo", en: "Yes, I have explored a new professional system" },
                { es: "hemos ampliado el enfoque para optimizar resultados", en: "We have expanded the approach to optimize results" },
                { es: "todavía necesito discutir esto con mi equipo", en: "I still need to discuss this with my team" }
            ]
        },
        {
            prompt_es: "¿Has logrado coordinar las expectativas con tu familia?",
            prompt_en: "Have you achieved coordinating the expectations with your family?",
            expected_responses: [
                { es: "sí, las expectativas han sido aclaradas hoy", en: "Yes, the expectations have been clarified today" },
                { es: "tenemos una motivación positiva para el futuro", en: "We have a positive motivation for the future" },
                { es: "aunque fue un proceso difícil, logramos avanzar", en: "Although it was a difficult process, we achieved moving forward" }
            ]
        },
        {
            prompt_es: "¿Por qué quieres actualizar la estrategia del sistema?",
            prompt_en: "Why do you want to update the system strategy?",
            expected_responses: [
                { es: "porque queremos optimizar el rendimiento diario", en: "Because we want to optimize the daily performance" },
                { es: "para reducir el riesgo de la situación actual", en: "To reduce the risk of the current situation" },
                { es: "una estrategia efectiva aumenta la posibilidad de éxito", en: "An effective strategy increases the possibility of success" }
            ]
        },
        {
            prompt_es: "¿Qué resultados has evaluado en el trabajo?",
            prompt_en: "What results have you evaluated at work?",
            expected_responses: [
                { es: "he evaluado un rendimiento muy positivo hoy", en: "I have evaluated a very positive performance today" },
                { es: "además los resultados del proceso son realistas", en: "In addition the process results are realistic" },
                { es: "todavía necesito analizar alguna información antes", en: "I still need to analyze some information before" }
            ]
        },
        {
            prompt_es: "¿Es posible adaptarse a esta cultura diferente?",
            prompt_en: "Is it possible to adapt to this different culture?",
            expected_responses: [
                { es: "sí, me he adaptado a su sociedad rápido", en: "Yes, I have adapted to their society quickly" },
                { es: "aunque es complicado, la cultura es buena", en: "Although it is complicated, the culture is good" },
                { es: "a pesar de los desafíos, el enfoque es positivo", en: "Despite the challenges, the approach is positive" }
            ]
        },
        {
            prompt_es: "¿Por lo tanto has decidido cancelar el viaje remoto?",
            prompt_en: "Therefore have you decided to cancel the remote trip?",
            expected_responses: [
                { es: "sí, el viaje a largo plazo es muy costoso", en: "Yes, the long term trip is very expensive" },
                { es: "no, quiero explorar ese lugar en el futuro", en: "No, I want to explore that place in the future" },
                { es: "todavía espero la confirmación del transporte", en: "I am still waiting for the transport confirmation" }
            ]
        },
        {
            prompt_es: "¿Qué concepto profesional quieres discutir hoy?",
            prompt_en: "What professional concept do you want to discuss today?",
            expected_responses: [
                { es: "quiero discutir la estrategia para lograr metas", en: "I want to discuss the strategy to achieve goals" },
                { es: "el concepto de enfoque realista del sistema", en: "The concept of realistic system approach" },
                { es: "necesitamos aclarar los resultados del mes antes", en: "We need to clarify the results of the month before" }
            ]
        },
        {
            prompt_es: "¿Has insistido en fortalecer la comunicación diaria?",
            prompt_en: "Have you insisted on strengthening daily communication?",
            expected_responses: [
                { es: "sí, para optimizar las conversaciones del equipo", en: "Yes, to optimize team conversations" },
                { es: "una buena comunicación reduce el riesgo de problemas", en: "Good communication reduces the risk of problems" },
                { es: "incluso con poco tiempo, es necesario hablar", en: "Even with little time, it is necessary to talk" }
            ]
        },
        {
            prompt_es: "¿Aunque la situación es difícil, el enfoque es efectivo?",
            prompt_en: "Although the situation is difficult, is the approach effective?",
            expected_responses: [
                { es: "sí, hemos logrado resultados muy positivos", en: "Yes, we have achieved very positive results" },
                { es: "por lo tanto queremos continuar con este plan", en: "Therefore we want to continue with this plan" },
                { es: "necesitamos evaluar el rendimiento una vez más", en: "We need to evaluate the performance once more" }
            ]
        },
        {
            prompt_es: "¿Cómo planeas aumentar la motivación de la sociedad?",
            prompt_en: "How do you plan to increase the motivation of society?",
            expected_responses: [
                { es: "aumentar la motivación es un proceso a largo plazo", en: "Increasing motivation is a long-term process" },
                { es: "con un sistema innovadora y un enfoque positivo", en: "With an innovative system and a positive approach" },
                { es: "discutir los desafíos ayuda a lograrlo", en: "Discussing the challenges helps to achieve it" }
            ]
        },
        {
            prompt_es: "¿Has analizado cuidadosamente la información del viaje?",
            prompt_en: "Have you carefully analyzed the trip information?",
            expected_responses: [
                { es: "sí, he revisado los boletos y el hotel antes", en: "Yes, I have reviewed the tickets and the hotel before" },
                { es: "el viaje a este lugar remoto tiene sus riesgos", en: "The trip to this remote place has its risks" },
                { es: "ya he preparado todo para el próximo mes", en: "I have already prepared everything for next month" }
            ]
        }
    ]
};
