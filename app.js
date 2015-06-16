var sampleData = [
  {
    id: 1,
    title: 'War and Peace',
    description: 'The epic tale of love, war and history',
    Author: 'Tolstoy',
    price: 7.99
  },
  {
    id: 2,
    title: 'Anna Karenina',
    description: 'How things go wrong in love and ultimately lead to suicide. This is why you should not have affairs, girls!',
    Author: 'Tolstoy',
    price: 8.50
  },
  {
    id: 3,
    title: "Fathers and Sons",
    description: "Another 19th century Russian novel",
    Author: "Turgenev",
    price: 11
  }
];

//create the new dataset
//var dataset = new recline.Model.Dataset({
//  records: sampleData,
//});


var dataset = new recline.Model.Dataset({
  url: 'https://docs.google.com/spreadsheets/d/1B6LKp6QzNqZFqRXoZ63lgK_T3pluSwtgCN7B1HSV0HU/edit#gid=0',
  backend: 'gdocs'

})

// Now do the query to the backend to load data
dataset.fetch().done(function(dataset) {
  if (console) {
    //console.log(dataset.records);
  }
});



// set up the routes
var AppRouter = Backbone.Router.extend({
    routes: {
        "items/:id": "getItem",
        "search/:qy": "searchItems",
        "*actions": "defaultRoute"
    }
});

var app_router = new AppRouter;
app_router.on('route:getItem', function(id) {
    showItem(id);
    console.log("item is" + id);
});

app_router.on('route:searchItems', function(qy){
  dataset.fetch();
  dataset.query({"q": qy});
});

Backbone.history.start();


// function that updates the data displayed
function updateDisplay(){

  var content = "";

  console.log(dataset.records);

  dataset.records.each(function(rec){
          content += "<p>title: " + rec.get('title') + " <a href='#/items/" + rec.id + "'>click</a></p>";
  });

  $("#data-display").html(content);

}

function doSearch(){
  dataset.fetch().done(function(dataset){

    updateDisplay();
  });
  updateDisplay();
  console.log(dataset.queryState.get('q'));
  app_router.navigate("search/" + dataset.queryState.get('q'));

}

function showItem(id){
  $("#data-display").html(
      dataset.records.get(id).get('title')
  )
}


// when a record gets queried the records are reset, so this will fire
dataset.records.bind('reset', doSearch);

// create the search box and add to the page
var queryEditor = new recline.View.QueryEditor({
    model: dataset.queryState
	  });
	  
$('#search').append(queryEditor.el);



	