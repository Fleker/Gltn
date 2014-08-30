importScripts('trace.js');

var Spreadsheet;
var sheet,
    errs,
    vals; 

self.onmessage = (function($__6) {
      oEvent = $__6;  
      if (oEvent.data instanceof Object && oEvent.data.hasOwnProperty("bk4e1h0") && oEvent.data.hasOwnProperty("ktp3fm1")) {
//          console.log("@" + oEvent.data.bk4e1h0 + oEvent.data.ktp3fm1);
//          console.log("@");
//          console.log(decodeURIComponent(oEvent.data.ktp3fm1));
          console.log((oEvent.data.ktp3fm1));
          console.log(decodeURIComponent(oEvent.data.ktp3fm1));
          Spreadsheet =  JSON.parse(decodeURIComponent(oEvent.data.ktp3fm1));
          for(var formula in Spreadsheet) {
//              console.log(":"+formula);
//              console.log("::"+Spreadsheet[formula]);
              if(formula.indexOf('_DOC') > -1)
                  Spreadsheet[formula] = JSON.parse(Spreadsheet[formula]);
              else
                  Spreadsheet[formula] = eval("("+Spreadsheet[formula]+")");
//              console.log(Spreadsheet[formula]);
          }    
          return;
      }
//  console.log("~");
  var $__7;
  var data = $traceurRuntime.assertObject($__6).data;
  ($__7 = [data, {}, {}], sheet = $__7[0], errs = $__7[1], vals = $__7[2], $__7);
  for (var $coord in sheet) {
    try {
      throw undefined;
    } catch (coord) {
      {
        coord = $coord;
        for (var $__2 = (function() {
          var $__0 = 0,
              $__1 = [];
          for (var $__4 = ['', '$'][Symbol.iterator](),
              $__5; !($__5 = $__4.next()).done; ) {
            try {
              throw undefined;
            } catch (p) {
              {
                p = $__5.value;
                for (var $__2 = [coord, coord.toLowerCase()][Symbol.iterator](),
                    $__3; !($__3 = $__2.next()).done; ) {
                  try {
                    throw undefined;
                  } catch (c) {
                    {
                      c = $__3.value;
                      $__1[$__0++] = p + c;
                    }
                  }
                }
              }
            }
          }
          return $__1;
        }())[Symbol.iterator](),
            $__3; !($__3 = $__2.next()).done; ) {
          try {
            throw undefined;
          } catch (name) {
            {
              name = $__3.value;
              {
                if ((Object.getOwnPropertyDescriptor(self, name) || {}).get) {
                  continue;
                }
                Object.defineProperty(self, name, {get: function() {
                    if (coord in vals) {
                      return vals[coord];
                    }
                    vals[coord] = NaN;
                    var x = +sheet[coord];
                    if (sheet[coord] !== x.toString()) {
                      x = sheet[coord];
                    }
//                    console.log("VC "+x+" "+ coord, vals, sheet);
                    try {
//                        console.log(coord)
                        //var x is the formula. Here I will scan for new functions to implement if they exist in the main object
                        if(('=' === x[0])) {
                            var regex;
                            var regout;
                            for(var formula in Spreadsheet) {
                                if(formula.indexOf('_DOC') > -1) {
//                                    console.log(formula, Spreadsheet[formula], Spreadsheet[formula].regexpIn === undefined);
                                    if(Spreadsheet[formula].regexpIn === undefined)
                                        continue;
                                    regex = new RegExp(Spreadsheet[formula].regexpIn, 'g');
                                    regout = Spreadsheet[formula].regexpOut;
                                } else {
                                    regex = new RegExp("("+formula+")", 'g');
                                    regout = "Spreadsheet.$1";
                                }
//                                console.log(x);
//                                console.log(regex, regout);
//                                console.log(x.match(regex));
//                                console.log(x.replace(regex
                                x = x.replace(regex, regout);
//                                console.log(x);
                            }
                            vals[coord] = eval.call(null, x.slice(1));
                        } else {
                            vals[coord] = x;
                        }
                    } catch (e) {
                        vals[coord] = x;
                      try {
                        throw undefined;
                      } catch (match) {
                        {
                          match = /\$?[A-Za-z]+[1-9][0-9]*\b/.exec(e);
                          if (match && !(match[0] in self)) {
                            self[match[0]] = 0;
                            delete vals[coord];
                            return self[coord];
                          }
                          errs[coord] = e.toString();
                        }
                      }
                    }
                    switch (typeof vals[coord]) {
                      case 'function':
                      case 'object':
                        vals[coord] += '';
                    }
                    return vals[coord];
                  }});
              }
            }
          }
        }
      }
    }
  }
  for (var $coord in sheet) {
    try {
      throw undefined;
    } catch (coord) {
      {
        coord = $coord;
        self[coord];
      }
    }
  }
  postMessage([errs, vals]);
});

//# sourceMappingURL=worker.map