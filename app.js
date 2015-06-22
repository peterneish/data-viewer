

$(document).ready(function() {
	
	router = new AppRouter();
	Backbone.history.start();
});	


// set up the routes
var AppRouter = Backbone.Router.extend({
	
	queryEditor: null,
	resultView: null,
	pager: null,
	facets: null,
	recordView: null,
	dataset: null,
	rec: null,
	dataPromise: null,
	
	
	initialize: function() {
		this.dataset = new recline.Model.Dataset({
			url: '//https://docs.google.com/spreadsheets/d/1B6LKp6QzNqZFqRXoZ63lgK_T3pluSwtgCN7B1HSV0HU/edit#gid=0',
			backend: 'gdocs'
		});
		
		// resultList
		this.resultView = new recline.View.Grid({
			model: this.dataset,
			el: $('#data-display')
		});
		this.resultView.visible = true;
		this.resultView.render();
		
		// search box
		this.queryEditor = new recline.View.QueryEditor({
			model: this.dataset.queryState
		});
		$('#search').append(this.queryEditor.el);

		//this.listenTo(this.queryEditor, 'submit form', this.searchSubmit);

		// pager
		this.pager = new recline.View.Pager({
			  model: this.dataset
			});
		$('#pager-here').append(this.pager.el);		

		//facets
		this.facets = new recline.View.FacetViewer({
			model: this.dataset
		});
		this.facets.render();
		$('#facets').append(this.facets.el);
		
		// now get the data and create a promise object
		that = this;
		this.dataPromise = this.dataset.fetch();
		
		// limit results
		$.when(this.dataPromise).then(function(){
			that.dataset.queryState.set({
				size: 5
			});
			that.dataset.queryState.addFacet('author');
		});
	},
	
    routes: {
		"": "startPage",
        "items/:id": "getItem",
        "search/:qy": "searchItems"
    },
	
	startPage: function (){
		this.resultView.render();
		self = this;
		$.when(this.dataPromise).then(function(d){
			self.resultView.render();
		});
	},
	 
	//handle a search via url 
	searchItems: function(qy){
    self = this;
    $.when(this.dataPromise).then(function(d){
      console.log(d);
		  d.query({"q": qy});
    });
	},

	// handle a submitted search
	searchSubmit: function(){
		//still trying to work out how to this and not kill the events in the 
		//queryEditor
		console.log("search submitted");
		//this.navigate("/search/test");
	},
	 
	// get a single item via url
	getItem: function (itemId){
		self = this;
		$.when(this.dataPromise).then( function(d){
			rec = self.dataset.records.get(itemId);
			
			//$.get('views/itemView.mst', function(t){
				
				//console.log(t);
							
				recView = new recline.View.ItemView({
					model: rec,
					template: '{{title}} {{id}}',
					el: '#item-display'
				});
				recView.set({'template': 'PAsswed {{title}} {{id}}'});

				recView.render();
			//});	
	  
		});	
	}
});

