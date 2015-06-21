

$(document).ready(function() {
	
	router = new AppRouter();
	Backbone.history.start();
});	


// set up the routes
var AppRouter = Backbone.Router.extend({
	
	queryEditor: null,
	resultView: null,
	pager: null,
	recordView: null,
	dataset: null,
	rec: null,
	dataPromise: null,
	
	
	initialize: function() {
		this.dataset = new recline.Model.Dataset({
			url: '//https://docs.google.com/spreadsheets/d/1B6LKp6QzNqZFqRXoZ63lgK_T3pluSwtgCN7B1HSV0HU/edit#gid=0',
			//url: 'https://docs.google.com/spreadsheet/ccc?key=0Aon3JiuouxLUdGZPaUZsMjBxeGhfOWRlWm85MmV0UUE#gid=0',
			backend: 'gdocs'
		});
		

		
		this.resultView = new recline.View.Grid({
			model: this.dataset,
			el: $('#data-display')
		});
		this.resultView.visible = true;
		this.resultView.render();
		
		this.queryEditor = new recline.View.QueryEditor({
			model: this.dataset.queryState
		});
		$('#search').append(this.queryEditor.el);	

		this.pager = new recline.View.Pager({
			  model: this.dataset
			});
		$('#pager-here').append(this.pager.el);		

		that = this;
		this.dataPromise = this.dataset.fetch();
		
		$.when(this.dataPromise).then(function(){
				that.dataset.queryState.set({
					size: 5
				});
		});
		//this.dataset.fetch().done(function(){
		//	that.resultView.render();
		//});
	},
	
    routes: {
		"": "startPage",
        "items/:id": "getItem",
        "search/:qy": "searchItems"
    },
	
	startPage: function (){
		console.log('ran startPage');
		this.resultView.render();
		self = this;
		$.when(this.dataPromise).then(function(d){
			self.resultView.render();
		});
		
		
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

