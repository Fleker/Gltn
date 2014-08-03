<!DOCTYPE html>
<html>
    <head>
        <title>Grid Sandbox</title>
        <meta charset="UTF-8">
        <script src='angular.js' type='text/javascript'></script>
        <script src='//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.13/angular-sanitize.min.js'></script>
    </head>
    <body ng-app="500lines" ng-controller="Spreadsheet" ng-cloak>
        {{ Locale.APPTITLE }}<br>
        <input id='setCol' data-sp='true' placeholder="{{Locale.COLUMNS}}" oninput="scope.remodel()" value="H">&emsp;X&emsp;<input data-sp='true' id='setRow' placeholder="{{Locale.ROWS}}" oninput="scope.remodel()" value="20">
        <br>
        <table><tr>
      <th><button type="button" ng-click="reset(); calc()">↻</button></th>
      <th ng-repeat="col in Cols">{{ col }}</th>
    </tr><tr ng-repeat="row in Rows">
      <th>{{ row }}</th>
      <td ng-repeat="col in Cols" ng-class="{ formula: ( '=' === sheet[col+row][0] ) }">
        <input id="{{ col+row }}" ng-model="sheet[col+row]" ng-change="calc()"
         ng-model-options="{ debounce: 200 }" ng-keydown="keydown( $event, col, row )">
        <div ng-class="{ error: errs[col+row], text: vals[col+row][0], formula: ( '=' === sheet[col+row][0] ) }" 
             ng-bind-html="renderHtml(errs[col+row] || vals[col+row])" >
            <!--{{ errs[col+row] || vals[col+row] }}-->
          </div></td></tr></table>
    </body>
    <script>    
        Spreadsheet = {
            IF: function(bool, tr, fl) {
                if(bool) {
                    return tr;    
                } else {
                    return fl;   
                }
            },
            SUB: function(txt) {
                return "<sub>"+txt+"</sub>";   
            }, 
            GRAV_EARTH: 9.81
        }
//        localStorage._Spreadsheet = JSON.stringify(Spreadsheet);
        var myApp = angular.module('500lines',['ngSanitize']);
        myApp.service('GridService', function() {
            var data;
            this.get = function() {
                return Spreadsheet;   
            }
        });
        myApp.controller('Spreadsheet', function ($scope, $timeout, $rootScope, GridService, $sce) {
            console.log("v3");
            var pass = {};
            for(i in GridService.get()) {
                console.log(i);
                pass[i] = GridService.get()[i].toString();
            }
            window.root = $rootScope;
            window.scope = $scope;
            $scope.strings = {
                /*APPTITLE: {
                    en_us: "GRID editor",
                    es: "edetor GRIDE"
                },*/
                en_us: {
                    APPTITLE: "GRID editor",
                    COLUMNS: "Cols",
                    ROWS: "Rows"
                },
                es: {
                    APPTITLE: "edetor GRIDE",
                    COLUMNS: "Clms",
                    ROWS: "Rws"
                }   
            };
            $scope.setLocale = function(loc_name) {
                //Reset, get all possible items first
                $scope.Locale = {};
//                console.log($scope.strings);
                for(loc in $scope.strings) {
//                    console.log(loc, $scope.strings[loc]);
                    for(i in $scope.strings[loc]) {
//                        console.log(i, loc, $scope.strings[loc]);
                        $scope.Locale[i] = i;   
                    }
                }
//                console.log($scope.Locale);
                //Now overwrite with local names
                for(i in $scope.strings[loc_name]) {
                    $scope.Locale[i] = $scope.strings[loc_name][i];
                }
//                console.log($scope.Locale);
                $scope.$apply();
            }
            $scope.setLocale("en_us");
            $scope.renderHtml = function(html_code) {
                if(html_code === undefined)
                    html_code = "";
                return $sce.trustAsHtml(html_code+"");
            };
      // Begin of $scope properties; start with the column/row labels
      $scope.Cols = [], $scope.Rows = [];

      $scope.makeRange = function (array, cur, end) { 
          array.length = 0;
          while (cur <= end) { 
              array.push(cur);
            // If it’s a number, increase it by one; otherwise move to next letter
            cur = (isNaN( cur ) ? String.fromCharCode( cur.charCodeAt()+1 ) : cur+1);
          } 
          $scope.$apply();
      }
      /*$scope.makeRange($scope.Cols, 'A', 'H');
      $scope.makeRange($scope.Rows, 1, 20);*/
      $scope.remodel = function() {
        //Re-'makeRange'   
          if(document.getElementById('setCol').value.length > 0)
            $scope.makeRange($scope.Cols, 'A', document.getElementById('setCol').value);
          if(document.getElementById('setRow').value.length > 0)
            $scope.makeRange($scope.Rows, 1, document.getElementById('setRow').value);
      }
      $scope.remodel();

      // UP(38) and DOWN(40)/ENTER(13) move focus to the row above (-1) and below (+1).
      $scope.keydown = function(event, col, row) { switch (event.which) {
        case 38: case 40: case 13: $timeout( function() {
            if((event.which === 13 && event.shiftKey === true) || event.which === 38)
                direction = -1;
            else
                direction = 1;
          var cell = document.querySelector( '#' + col + (row + direction) );
          if (cell) { cell.focus(); }
        } );
      } };

      // Default sheet content, with some data cells and one formula cell.
      $scope.reset = function() { $scope.sheet = { A1: 1874, B1: '+', C1: 2046, D1: '⇒', E1: '=A1+C1' }; };

      // Define the initializer, and immediately call it
      ($scope.init = function() {
        // Restore the previous .sheet; reset to default if it’s the first run
          //FIMXME storage
        $scope.sheet = angular.fromJson( localStorage.getItem( '' ) );
        if (!$scope.sheet) { $scope.reset(); }
          $scope.worker = new QueryableWorker("worker.js", function(message) {
//              console.log(message);
               $timeout.cancel( $scope.promise );
              $timeout( function() { $scope.errs = message.data[0], $scope.vals = message.data[1]; } );
          });
          $scope.worker.sendQuery('setSS', JSON.stringify(pass));
//          $scope.worker = new Worker('worker.js');
          window.worker = $scope.worker;
      }).call();

      // Formula cells may produce errors in .errs; normal cell contents are in .vals
      $scope.errs = {}, $scope.vals = {};

      // Define the calculation handler; not calling it yet
      $scope.calc = function() {
        var json = angular.toJson( $scope.sheet );
        $scope.promise = $timeout( function() {
          // If the worker has not returned in 499 milliseconds, terminate it
          $scope.worker.terminate();
          // Back up to the previous state and make a new worker
          $scope.init();
          // Redo the calculation using the last-known state
          $scope.calc();
        }, 99 );

        // When the worker returns, apply its effect on the scope
        $scope.worker.onmessage = function(message) {
            console.log(message);
          $timeout.cancel( $scope.promise );
          localStorage.setItem( '', json );
          $timeout( function() { $scope.errs = message.data[0], $scope.vals = message.data[1]; } );
        };

        // Post the current sheet content for the worker to process
        $scope.worker.postMessage( $scope.sheet );
      };

      // Start calculation when worker is ready
      $scope.worker.onmessage = $scope.calc;
      $scope.worker.postMessage( $scope.sheet );
    });
        
        function clone(obj, kind) {
            function OneShotConstructor(){}
            OneShotConstructor.prototype = obj;
            if(kind !== undefined)
                OneShotConstructor.constructor = kind;
            return new OneShotConstructor();
        }
    /* FROM MOZ
    QueryableWorker instances methods:
     * sendQuery(queryable function name, argument to pass 1, argument to pass 2, etc. etc): calls a Worker's queryable function
     * postMessage(string or JSON Data): see Worker.prototype.postMessage()
     * terminate(): terminates the Worker
     * addListener(name, function): adds a listener
     * removeListener(name): removes a listener
    QueryableWorker instances properties:
     * defaultListener: the default listener executed only when the Worker calls the postMessage() function directly
  */
      function QueryableWorker (sURL, fDefListener, fOnError) {
        var oInstance = this, oWorker = new Worker(sURL), oListeners = {};
        this.defaultListener = fDefListener || function () {};
        /*oWorker.onmessage = function (oEvent) {
          if (oEvent.data instanceof Object && oEvent.data.hasOwnProperty("vo42t30") && oEvent.data.hasOwnProperty("rnb93qh")) {
            oListeners[oEvent.data.vo42t30].apply(oInstance, oEvent.data.rnb93qh);
          } else {
              console.log(oEvent.data[0]);
            this.defaultListener.call(oInstance, oEvent.data);
          }
        };*/
          oWorker.onmessage = fDefListener;
        if (fOnError) { oWorker.onerror = fOnError; }
        this.sendQuery = function (/* queryable function name, argument to pass 1, argument to pass 2, etc. etc */) {
          if (arguments.length < 1) { throw new TypeError("QueryableWorker.sendQuery - not enough arguments"); return; }
//            console.log(arguments[1]);
          oWorker.postMessage({ "bk4e1h0": arguments[0], "ktp3fm1": arguments[1] });
//          oWorker.postMessage({ "bk4e1h0": arguments[0], "ktp3fm1": Array.prototype.slice.call(arguments, 1) });
        };
        this.postMessage = function (vMsg) {
          //I just think there is no need to use call() method
          //how about just oWorker.postMessage(vMsg);
          //the same situation with terminate
          //well,just a little faster,no search up the prototye chain
          Worker.prototype.postMessage.call(oWorker, vMsg);
        };
        this.terminate = function () {
          Worker.prototype.terminate.call(oWorker);
        };
        this.addListener = function (sName, fListener) {
          oListeners[sName] = fListener;
        };
        this.removeListener = function (sName) {
          delete oListeners[sName];
        };
      };

    </script>
    <style>
        body { font-family: sans-serif; }
        table { border-collapse: collapse; }
th, td { border: 1px solid #ccc; }
th { background: #ddd; }
td.formula {  }
td div { text-align: right; width: 120px; min-height: 1.2em;
         overflow: hidden; text-overflow: ellipsis; }
div.text { text-align: left;} 
div.error { text-align: center; color: #800; font-size: 90%; border: solid 1px #800 }
div.formula { background-color: #dfd}
input { position: absolute; border: 0; padding: 0; width: 120px; height: 1.3em;
        /*font-size: 26pt;*/ color: transparent; background: transparent; transition-duration:0.3s;margin-top:0em; padding-left:0px;}
input:not([data-sp=true]) + div { transition-duration:0.3s; padding-left:0px; padding-right:0px; background-color: #fff;  }
input:not([data-sp=true]):focus { color: #111; background: #efe; font-size:70%; font-weight:bold; width: 360px; margin-left: -120px; margin-top:-1.4em; padding-left:8px;}
input:not([data-sp=true]):focus + div { white-space: nowrap; font-weight:bold; background-color: #bfb; padding-left: 4px; padding-right: 4px; }
input[data-sp=true] { 
    color: black;
    background-color: antiquewhite;
    position: inherit;    
}
    </style>
</html>