# Testing Course
## mocha chai

```
npm init 
npm i mocha
npm i -D chai
npm i -D cross-env  
npm i -D chai-as-promised  
npm i  -D sinon 
npm i -D chai-as-promised
npm i rewire                   
```

1. Rewire le permite simular FS y otros módulos de nodos. También da acceso a variables privadas en el código que desea probar.
- Recuerde usar let en lugar de const cuando use rewire para importar un módulo, es fácil pasarlo por alto cuando usas const todo en la parte superior de su código. Esto se debe a que rewire inyectará las versiones rewired y las restableceremos durante el desmontaje. Está bien usar const para requerir que se vuelva a cablear, pero usar let para todo lo demás.

```
const rewire = require('rewire');
let myModule = rewire('../path/to/custom/module');
```