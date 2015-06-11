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

var dataset = new recline.Model.Dataset({
  records: sampleData
});

$("#data-display").html(
      JSON.stringify(dataset.records.toJSON(), null, 2)
)

var queryEditor = new recline.View.QueryEditor({
    model: dataset.queryState
	  });
	  
$('#search').append(queryEditor.el);


	