var pizza, preco, imagem;
var PIZZARIA_ID = 'Pizzaria_Valinhense';
var listaPizzasCadastradas = [];

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    cordova.plugin.http.setDataSerializer('json');

    imagem = document.getElementById('imagem');
    pizza = document.getElementById('pizza');
    preco = document.getElementById('preco');

    document.getElementById('btnNovo').addEventListener('click', novo);
    document.getElementById('btnFoto').addEventListener('click', foto);
    document.getElementById('btnSalvar').addEventListener('click', salvar);
    document.getElementById('btnExcluir').addEventListener('click', excluir);    
    document.getElementById('btnCancelar').addEventListener('click', cancelar);

    carregarPizzas();
}

function novo() {
    applista.style.display = 'none'; 
    appcadastro.style.display = 'flex';
}

function foto() {
    navigator.camera.getPicture(onSuccess, 
                                onFail, 
                                { quality: 50, 
                                  destinationType: Camera.DestinationType.DATA_URL }
                               );  
    
    function onSuccess(imageData) {
        imagem.style.backgroundImage = "url('data:image/jpeg;base64," + imageData + "')"; 
    }  
    
    function onFail(message) { 
        alert('Failed because: ' + message); 
    }
}

function salvar() {
    cordova.plugin.http.setDataSerializer('json');
    cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/admin/pizza/', {
        pizzaria: PIZZARIA_ID, 
        pizza: pizza.value, 
        preco: preco.value, 
        imagem: imagem.style.backgroundImage
    }, {}, function(response) {
        alert(response.status);
    }, function(response) {
        alert(response.error);
    });
}

function excluir() {
    var NOME_PIZZA = document.getElementById('pizza').value;
    cordova.plugin.http.delete('https://pedidos-pizzaria.glitch.me/admin/pizza/'+ PIZZARIA_ID + '/' +  NOME_PIZZA,{ 
    }, {}, function(response) {
        alert(response.status);
    }, function(response) {
        alert(response.error);
    });
}

function cancelar() {  
    applista.style.display = 'flex';
    appcadastro.style.display = 'none';
}

function carregarPizzas() {
    cordova.plugin.http.get('https://pedidos-pizzaria.glitch.me/admin/pizzas/' + PIZZARIA_ID, {   
    }, {}, function(response) {
        if(response.data != null) {
            listaPizzasCadastradas = JSON.parse(response.data);
            listaPizzasCadastradas.forEach((item, idx) => {
                const novo = document.createElement('div');
                novo.classList.add('linha');
                novo.innerHTML = item.pizza;
                novo.id = idx;
                novo.onclick = function () {
                    carregarDadosPizza(novo.id);
                    applista.style.display = 'none';
                    appcadastro.style.display = 'flex';
                };
                listaPizzas.appendChild(novo);
            });
        }
    }, function(response) {
        alert(response.error);
    });     
}

function carregarDadosPizza(id) {
    imagem.style.backgroundImage = listaPizzasCadastradas[id].imagem;
    pizza.value = listaPizzasCadastradas[id].pizza;
    preco.value = listaPizzasCadastradas[id].preco;
    let idPizza = listaPizzasCadastradas[id]._id;
    btnSalvar.onclick = function() {
        attPizza(idPizza);
    }
}

function attPizza(id) {
    cordova.plugin.http.put('https://pedidos-pizzaria.glitch.me/admin/pizza/', {
        pizzaid: id, 
        pizzaria: PIZZARIA_ID, 
        pizza: pizza.value, 
        preco: preco.value, 
        imagem: imagem.style.backgroundImage
    }, {}, function(response){
        alert(response.status);
    }, function(response){
        console.log(response.error);
        alert(response.error);
    })
}