            // Your web app's Firebase configuration
            var firebaseConfig = {
                apiKey: "AIzaSyDtXOvG9tmXRYjDD7O3EYjzz2syivlbTAA",
                authDomain: "horno-panadero.firebaseapp.com",
                databaseURL: "https://horno-panadero-default-rtdb.firebaseio.com",
                projectId: "horno-panadero",
                storageBucket: "horno-panadero.appspot.com",
                messagingSenderId: "310370306205",
                appId: "1:310370306205:web:64ff344cc779b97dffac74"
            };
            
            var rango = 35;
            var temperatura;
            var temperatura_arreglo = [];
            var exportarArreglo = new Array(rango).fill(0);

            // Iniciando Firebase
            firebase.initializeApp(firebaseConfig);

            const dbRef = firebase.database().ref('Nodemcu/TThermok').limitToLast(rango);

            dbRef.on('value', function (snapshot) {
                if (snapshot.exists()) {
                    var temp1 = snapshot.val();
                    //console.log("Info: "+temp1);
                }else{
                    console.log("No hay info disponible");
                }
                printData();
                read_temp_Arreglo();
            });

            function printData() {
                var baseRef = firebase.database().ref('Nodemcu/TThermok').limitToLast(rango);
                baseRef.on('value', (snapshot) => 
                {
                    snapshot.forEach(function(childSnapshot)
                    {
                        var childKey = childSnapshot.key;
                        var childData = childSnapshot.val();
                        //console.log("Valor de data en child: " + childData);
                        document.getElementById("data").innerHTML = childData+" °C";
                    })
                });
            }

            function read_temp_Arreglo() {
                // Get a reference to the database service
                var temp;
                var tempRef = firebase.database().ref('Nodemcu/TThermok').limitToLast(rango);
                
                tempRef.on('value', function (snapshot) {
                    var tempAux = snapshot.val();
                    console.log(tempAux);
                    for (var index in tempAux) {
                        console.log("Entrando en for de temp_arreglo");
                        temp = tempAux[index];
                        temperatura_arreglo.push(temp);
                        console.log(temperatura_arreglo);
                    }
                    exportarArreglo = temperatura_arreglo;
                });
            }
