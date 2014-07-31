<!DOCTYPE html>
<html>
    <head>
        <title>Grid Sandbox</title>
        <meta charset="UTF-8">
        <script src='angular.js' type='text/javascript'></script>
    </head>
    <body ng-app="500lines" ng-controller="Spreadsheet" ng-cloak>
        <table><tr>
      <th><button type="button" ng-click="reset(); calc()">↻</button></th>
      <th ng-repeat="col in Cols">{{ col }}</th>
    </tr><tr ng-repeat="row in Rows">
      <th>{{ row }}</th>
      <td ng-repeat="col in Cols" ng-class="{ formula: ( '=' === sheet[col+row][0] ) }">
        <input id="{{ col+row }}" ng-model="sheet[col+row]" ng-change="calc()"
         ng-model-options="{ debounce: 200 }" ng-keydown="keydown( $event, col, row )">
        <div ng-class="{ error: errs[col+row], text: vals[col+row][0] }">
          {{ errs[col+row] || vals[col+row] }}</div></td></tr></table>
    </body>
    <script>
        angular.module('500lines', []).controller('Spreadsheet', function ($scope, $timeout) {
  // Begin of $scope properties; start with the column/row labels
  $scope.Cols = [], $scope.Rows = [];
  makeRange($scope.Cols, 'A', 'H');
  makeRange($scope.Rows, 1, 20);
  function makeRange(array, cur, end) { while (cur <= end) { array.push(cur);
    // If it’s a number, increase it by one; otherwise move to next letter
    cur = (isNaN( cur ) ? String.fromCharCode( cur.charCodeAt()+1 ) : cur+1);
  } }

  // UP(38) and DOWN(40)/ENTER(13) move focus to the row above (-1) and below (+1).
  $scope.keydown = function(event, col, row) { switch (event.which) {
    case 38: case 40: case 13: $timeout( function() {
        console.log(event);
      var direction = (event.which === 38) ? -1 : +1;
      var cell = document.querySelector( '#' + col + (row + direction) );
      if (cell) { cell.focus(); }
    } );
  } };

  // Default sheet content, with some data cells and one formula cell.
  $scope.reset = function() { $scope.sheet = { A1: 1874, B1: '+', C1: 2046, D1: '⇒', E1: '=A1+C1' }; };

  // Define the initializer, and immediately call it
  ($scope.init = function() {
    // Restore the previous .sheet; reset to default if it’s the first run
    $scope.sheet = angular.fromJson( localStorage.getItem( '' ) );
    if (!$scope.sheet) { $scope.reset(); }
      $scope.worker = new Worker("http://audreyt.github.io/500lines/spreadsheet/es5/worker.js");
  }).call();

  // Formula cells may produce errors in .errs; normal cell contents are in .vals
  $scope.errs = {}, $scope.vals = {};

  // Define the calculation handler; not calling it yet
  $scope.calc = function() {
    var json = angular.toJson( $scope.sheet );
    var promise = $timeout( function() {
      // If the worker has not returned in 499 milliseconds, terminate it
      $scope.worker.terminate();
      // Back up to the previous state and make a new worker
      $scope.init();
      // Redo the calculation using the last-known state
      $scope.calc();
    }, 99 );

    // When the worker returns, apply its effect on the scope
    $scope.worker.onmessage = function(message) {
      $timeout.cancel( promise );
      localStorage.setItem( '', json );
      $timeout( function() { $scope.errs = message.data[0], $scope.vals = message.data[1]; } );
    };

    // Post the current sheet content for the worker to process
    $scope.worker.postMessage( $scope.sheet );
  };

  // Start calculation when worker is ready
  $scope.worker.onmessage = $scope.calc;
  $scope.worker.postMessage( null );
});

// Worker.js
function WorkerJS () {
  var sheet, errs, vals;
  self.onmessage = function(message) {
    sheet = message.data, errs = {}, vals = {};

    Object.getOwnPropertyNames(sheet || {}).forEach(function(coord) {
      // Four variable names pointing to the same coordinate: A1, a1, $A1, $a1
      [ '', '$' ].forEach(function(p) { [ coord, coord.toLowerCase() ].forEach(function(c){
        var name = p+c;

        // Worker is reused across computations, so only define each variable once
        if ((Object.getOwnPropertyDescriptor( self, name ) || {}).get) { return; }

        // Define self['A1'], which is the same thing as the global variable A1
        Object.defineProperty( self, name, { get: function() {
          if (coord in vals) { return vals[coord]; }
          vals[coord] = NaN;

          // Turn numeric strings into numbers, so =A1+C1 works when both are numbers
          var x = +sheet[coord];
          if (sheet[coord] !== x.toString()) { x = sheet[coord]; }

          // Evaluate formula cells that begin with =
          try { vals[coord] = (('=' === x[0]) ? eval.call( null, x.slice( 1 ) ) : x);
          } catch (e) {
            var match = /\$?[A-Za-z]+[1-9][0-9]*\b/.exec( e );
            if (match && !( match[0] in self )) {
              // The formula refers to a uninitialized cell; set it to 0 and retry
              self[match[0]] = 0;
              delete vals[coord];
              return self[coord];
            }
            // Otherwise, stringify the caught exception in the errs object
            errs[coord] = e.toString();
          }
          // Turn vals[coord] into a string if it's not a number or boolean
          switch (typeof vals[coord]) { case 'function': case 'object': vals[coord]+=''; }
          return vals[coord];
        } } );
      }); });
    });

    // For each coordinate in the sheet, call the property getter defined above
    for (var coord in sheet) { self[coord]; }
    postMessage([ errs, vals ]);
  };
}

    </script>
</html>