// set up the app
var app_router;
var dataset;
var havedata = false;

fetchData();

// set up the routes
var AppRouter = Backbone.Router.extend({
    routes: {
        "items/:id": "getItem",
        "search/:qy": "searchItems",
        "*actions": "defaultRoute" 
    }
});

app_router = new AppRouter;
app_router.on('route:getItem', function(id) {
    showItem(id);
});

app_router.on('route:searchItems', function(qy){
  doSearch(qy);
});

app_router.on('route:defaultRoute', function(){
  console.log("defaultroute");
})

Backbone.history.start();

// create the search box and add to the page
var queryEditor = new recline.View.QueryEditor({
    model: dataset.queryState
});
    
$('#search').append(queryEditor.el); 

function fetchData(callback){
  
  if(dataset && typeof dataset.queryState !== 'undefined'){
     if(callback && typeof callback === 'function' ){
        callback(dataset);
      } 
  }
  else{
      dataset = new recline.Model.Dataset({
        url: 'https://docs.google.com/spreadsheets/d/1B6LKp6QzNqZFqRXoZ63lgK_T3pluSwtgCN7B1HSV0HU/edit#gid=0',
        backend: 'gdocs'
      });

      dataset.fetch().done(
            if(callback && typeof callback === 'function' ){
                callback(dataset);
            }
      );

      // when a record gets queried the records are reset, so this will fire
      dataset.records.bind('reset', doSearch);
  
  }

}

// function that updates the data displayed
function doSearch(qy){

  fetchData(function(d){
      d.query({"q": qy});

  });

  app_router.navigate("search/" + qy);




  dataset.records.each(function(rec){
          content += "<p>title: " + rec.get('title') + " <a href='#/items/" + rec.id + "'>click</a></p>";
  });

  $("#data-display").html(content);
  $('#data-display').show();
  $('#item-display').hide();
}


// TODO - use templates or custom view
function showItem(id){

    fetchData();

    rec = dataset.records.get(id);

      $('#item-display').show();
      $('#data-display').hide();
      $('#item-display').html(
          '<b>'+ rec.get('title') + '</b> '
               + rec.get('description')
      );
}
