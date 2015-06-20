
$(document).ready(function() {
	router = new AppRouter();
	Backbone.history.start();
});	


// set up the routes
var AppRouter = Backbone.Router.extend({
	
	queryEditor: null,
	resultView: null,
	recordView: null,
	dataset: null,
	rec: null,
	dataPromise: null,
	
	
	initialize: function() {
		this.dataset = new recline.Model.Dataset({
			url: 'https://docs.google.com/spreadsheets/d/1B6LKp6QzNqZFqRXoZ63lgK_T3pluSwtgCN7B1HSV0HU/edit#gid=0',
			backend: 'gdocs'
		});
		this.dataPromise = this.dataset.fetch();
		this.queryEditor = new recline.View.QueryEditor({
			model: this.dataset.queryState
		});
		$('#search').append(this.queryEditor.el);		
		
		this.dataView = new recline.View.SlickGrid({
			model: this.dataset,
		});
		$('#data-display').append(this.dataView.el);
		this.dataView.visible = true;
		this.dataView.render();
		this.dataset.records.bind('reset', this.dataView.render);
	
	},
	
    routes: {
		"": "startPage",
        "items/:id": "getItem",
        "search/:qy": "searchItems"
    },
	
	startPage: function (){
		console.log('ran startPage');
		this.dataView.render();
	 },
	 
	 searchItem: function(qy){
		this.dataset.query("q", qy); 
	 },
	 
	
	getItem: function (itemId){
		console.log('ran getItem');
		$.when(this.dataPromise).then( function(d){
		this.rec = d.records.get(itemId);
			
		   $('#item-display').show();
		   $('#data-display').hide();
		   $('#item-display').html(
			   '<b>'+ this.rec.get('title') + '</b> '
				    + this.rec.get('description')
		   );
		});	
	}
});



/*
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
*/

