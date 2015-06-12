var sampleData = [
  {
    title: 'War and Peace',
    description: 'The epic tale of love, war and history',
    Author: 'Tolstoy',
    price: 7.99
  },
  {
    title: 'Anna Karenina',
    description: 'How things go wrong in love and ultimately lead to suicide. This is why you should not have affairs, girls!',
    Author: 'Tolstoy',
    price: 8.50
  },
  {
    title: "Fathers and Sons",
    description: "Another 19th century Russian novel",
    Author: "Turgenev",
    price: 11
  }
];

//create the new dataset
var dataset = new recline.Model.Dataset({
  records: sampleData
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
    console.log("item is" + id);
});

app_router.on('route:searchItems', function(qy){
  dataset.query({"q": qy});
});

Backbone.history.start();


// function that updates the data displayed
function updateDisplay(){
  $("#data-display").html(
      JSON.stringify(dataset.records.toJSON(), null, 2)
  );

}

function doSearch(){
  updateDisplay();
  console.log(dataset.queryState.get('q'));
  app_router.navigate("search/" + dataset.queryState.get('q'));

}


// when a record gets queried the records are reset, so this will fire
dataset.records.bind('reset', doSearch);

// create the search box and add to the page
var queryEditor = new recline.View.QueryEditor({
    model: dataset.queryState
	  });
	  
$('#search').append(queryEditor.el);



	