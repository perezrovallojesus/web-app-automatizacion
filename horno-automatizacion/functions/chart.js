    
    google.charts.load('current', {packages: ['gauge'] });
    google.charts.load('current', {packages: ['corechart', 'line']});
    //google.charts.setOnLoadCallback(drawCurveTypes);
    google.charts.setOnLoadCallback(drawGauge);
    google.charts.setOnLoadCallback(drawGraphic);

    var gTemp = [];
    var gYear = [];
    var gMonth = [];
    var gDay = [];
    var gHour = [];
    var gMinute = [];
    var cantData = rango;
    var gDate = new Date();

    //  Función para dibujar medidor de temperatura
    function drawGauge() {
        var data = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['C°', 1]
        ]);

        var optionsGauge = {
            min: 0, 
            max: 300,
            width: 500, 
            height: 200,
            greenFrom:50, 
            greenTo: 150,
            yellowFrom:150, 
            yellowTo: 200,
            redFrom: 200, 
            redTo: 300,
            majorTicks: [0, 50, 100, 150, 200, 250, 300],
            minorTicks: 10
        };

        var chart = new google.visualization.Gauge(document.getElementById('gauge_div'));
        chart.draw(data, optionsGauge);
        setInterval(function() {
            data.setValue(0, 1, temperatura_arreglo[rango-1]);
            chart.draw(data, optionsGauge);
        }, 1000);

    }

    //  Función para leer los valores de la medición
    function loadValues(){
        
        gTemp = [];
        gYear = [];
        gMonth = [];
        gDay = [];
        gHour = [];
        gMinute = [];

        var year = firebase.database().ref('Nodemcu/Ano').limitToLast(rango);
        var month = firebase.database().ref('Nodemcu/Mes').limitToLast(rango);
        var day = firebase.database().ref('Nodemcu/Dia').limitToLast(rango);
        var hour = firebase.database().ref('Nodemcu/Hora').limitToLast(rango);
        var minute = firebase.database().ref('Nodemcu/Minutos').limitToLast(rango);
        var temp =  firebase.database().ref('Nodemcu/TThermok').limitToLast(rango);
        
        // Leer y cargar temperatura
        temp.on('value', function (snapshot){
            var tempAux = snapshot.val();
            var currentValue;
            for (var key in tempAux){
                currentValue = tempAux[key];
                gTemp.push(parseFloat(currentValue));
            }
            //console.log("gTemp: "+ gTemp);
            //temp = gTemp;
        });
        // Leer y cargar año
        year.on('value', function (snapshot){
            var yearAux = snapshot.val();
            var currentValue;
            for (var key in yearAux){
                currentValue = yearAux[key];
                gYear.push(parseFloat(currentValue));
            }
            //console.log("gYear: "+ gYear);
            //temp = gYear;
        });
        // Leer y cargar mes
        month.on('value', function (snapshot){
            var monthAux = snapshot.val();
            var currentValue;
            for (var key in monthAux){
                currentValue = monthAux[key];
                gMonth.push(parseFloat(currentValue));
            }
            //console.log("gMonth: "+ gMonth);
            //temp = gMonth;
        });
        // Leer y cargar día
        day.on('value', function (snapshot){
            var dayAux = snapshot.val();
            var currentValue;
            for (var key in dayAux){
                currentValue = dayAux[key];
                gDay.push(parseFloat(currentValue));
            }
            //console.log("gDay: "+ gDay);
            //temp = gDay;
        });
        // Leer y cargar hora
        hour.on('value', function (snapshot){
            var hourAux = snapshot.val();
            var currentValue;
            for (var key in hourAux){
                currentValue = hourAux[key];
                gHour.push(parseFloat(currentValue));
            }
            //console.log("gHour: "+ gHour);
            //temp = gDay;
        });
        // Leer y cargar minutos
        minute.on('value', function (snapshot){
            var minuteAux = snapshot.val();
            var currentValue;
            for (var key in minuteAux){
                currentValue = minuteAux[key];
                gMinute.push(parseFloat(currentValue));
            }
            //console.log("gMinute: "+ gMinute);
            //temp = gMinute;
        });
    }

    //  Función para dibujar gráfica - 2do intento (con fecha)
    function drawGraphic() {

        loadValues();

        var dataGraphic = new google.visualization.DataTable();
        dataGraphic.addColumn('datetime', 'Time');
        dataGraphic.addColumn('number', 'Temperatura');

        var optionsGraphic = {
            hAxis: {
                title: 'Tiempo'
            },
            vAxis: {
            title: 'Grados'
            },
            pointsVisible: true,
            backgroundColor: '#f9f9f9',
            colors: ['blue'],
            series: {
            1: {curveType: 'function'}
            }
        };

        var formatDate = new google.visualization.DateFormat({
            prefix: 'Time: ', pattern: "dd MMM HH:mm"
        });

        formatDate.format(dataGraphic, 0);

        var chart = new google.visualization.LineChart(document.getElementById("chartGraphic_div"));
        setInterval(function(){
            dataGraphic = new google.visualization.DataTable();
            dataGraphic.addColumn('datetime', 'Tiempo');
            dataGraphic.addColumn('number','Grados');
            for (i=0; i<rango; i++){
                dataGraphic.addRow(
                    [new Date(gYear[i], gMonth[i], gDay[i], gHour[i], gMinute[i]), gTemp[i]]
                );
            }
            chart.draw(dataGraphic, optionsGraphic);
        }, 1000);
        
    }

/*
    // Función para crear la línea temporal de la gráfica
    function range(start, end){
        return Array(end - start +1).fill().map((_, idx) => start + idx)
    }
    
    //  Función para dibujar gráfica - 1er intento
    function drawCurveTypes() {

        // Creación de los vectores a utilizarse en la gráfica
        console.log("rango es: " + rango + " y el último val de temp es: " + temperatura_arreglo[rango-1]);
        var tiempo = range(1,rango);
        var colRef = new Array(rango).fill(0);
        var randoms = [...Array(rango)].map(() => Math.floor((Math.random() * 5)+85));
        console.log("chat-log: "+tiempo+" "+randoms);
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', 'Temperatura');
        data.addColumn('number', 'Referencia');

        for(i = 0; i < tiempo.length; i++)
            data.addRow([tiempo[i],temperatura_arreglo[i],colRef[i]])

        var options = {
            hAxis: {
            title: 'Tiempo'
            },
            vAxis: {
            title: 'Grados'
            },
            series: {
            1: {curveType: 'function'}
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
*/