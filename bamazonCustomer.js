var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  var productid
  var quantity

  inquirer
    .prompt({
      name: "id",
      type: "input",
      message: "What is the ID of the product you would like to buy?"}).
    then(function(answer){
    	productid = answer.id
  		inquirer
    		.prompt({
      			name: "quantity",
      			type: "input",
      			message: "How many units would you like to buy?"}).
    			then(function(answer){
    				quantity = answer.quantity
    				queryDatabase(productid,quantity);
    				console.log(answer);
    			})
    	console.log(answer);
    })
}
function queryDatabase(productid,quantity){
	console.log("querying database with product id " + productid + " quantity " + quantity);
	connection.query("select * from bamazonDB.products where ?", [{item_id:productid}],
		    function(err, res) {
      			console.log(res);
      			if(res[0].stock_quantity > quantity){
					console.log("I have enough");
					var newQuantity = res[0].stock_quantity-quantity
					connection.query("update bamazonDB.products set ? where ?", 
						[{stock_quantity:newQuantity},{item_id:productid}],
						function(err, res){
							if(err) throw err;
							console.log(res.affectedRows + " records affected");
						}
						)
				}
				else{
					console.log("Insufficient quantity!");
				}
 
    })













}