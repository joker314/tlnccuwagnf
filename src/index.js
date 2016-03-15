var code = `

my_var => 9001;
my_add_ten => fn(x){
    return(+(x, 10));
};
if(true, fn(){
    print(my_add_ten(my_var));
});

`;

require('source-map-support').install();
var nearley = require('nearley');
var grammar = require('./grammar');
var run = require('./run');

var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

try {
  var result = run.run(code);
  // console.log('result:', result);
  // console.log('all ASTs:', JSON.stringify(asts, null, 1));
  // console.log('AST:', JSON.stringify(ast, null, 1));
} catch(e) {
  if (e.offset) {
    console.error("Syntax error on character " + e.offset);
    var i = e.offset;
    var line = '';
    while (code[i] && code[i] !== '\n') {
      line = code[i] + line;
      i--;
    }
    var lineStartOff = i + 1;
    i = e.offset + 1;
    while (code[i] && code[i] !== '\n') {
      line = line + code[i];
      i++;
    }
    console.error('line:\n' + line + '\n' + ' '.repeat(e.offset - lineStartOff) + '^');
  } else if (e.expr) {
    console.error(e.stack);
    console.error(e.expr);
  } else {
    throw e;
  }
}