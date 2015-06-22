// (c) Peter Neish 2015, Digital Scholarship, University of Melbourne.
// MIT licence

/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function($, my) {
  "use strict";
my.ItemView = Backbone.View.extend({
	className: 'recline-item-view',
	tagName:  "div",
	template: '\
		<div> \
			<h2>{{title}}</h2> \
			<p>{{description}}</p> \
		</div>\
	',
		
	initialize: function(initData) {
		_.bindAll(this, 'render');
		this.listenTo(this.model, 'change', this.render);
		if(initData.template
		this.render();
	},
	render: function() {
		var tmplData = this.model.toJSON();
		var templated = Mustache.render(this.template, tmplData);
		this.$el.html(templated);
	}
});

})(jQuery, recline.View);