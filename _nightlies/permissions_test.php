<html>
    <head>
        <script type="text/javascript" src="https://rawgithub.com/stacktracejs/stacktrace.js/master/stacktrace.js"></script>
    </head>
    <body>
        <script>
            z = 55;
            function Item(title) {
                this.name = title;
                this.permission = false;
                Item.prototype.getWindow = function() {
                    return getZ();   
                };
                Item.prototype.getCitations  = function() {
                    return new File().getCitations();   
                };
            }
            function File() {
                this.citations = "H";
                File.prototype.getCitations = function() {
                    var myCallee = arguments.callee;
                    var myCallerName = arguments.callee.caller.name;
                    var hisCallee = myCallee.caller.arguments.callee;
                    var hisCallerName = hisCallee.caller.name;
                    console.error(myCallee);
                    console.error(myCallerName);
                    console.error(hisCallee);
                    console.error(hisCallerName);
                    console.error(hisCallee.caller.arguments.callee);
                    
                    return this.citations;   
                }
            }
            function getZ() {
                console.log(this.displayName, this.caller); 
                return z;   
            }
            function logStackTrace(stack) {
                console.log(stack.join('\n'));
            }
            var p = new printStackTrace.implementation();
            p.instrumentFunction(this, 'getZ', logStackTrace);
            
            function runTest() {
                console.log("runTest caller name", callerName());
                callMe();
            }



            function callMe() {
                console.log("callMe caller name", callerName());
            }

            function callerName() {
                try {
                    var myCallee = arguments.callee;
                    var hisCallee = myCallee.caller.arguments.callee;
                    var hisCallerName = hisCallee.caller.name;
                    console.log(hisCallerName);

                    if ((hisCallerName === null || hisCallerName.toString() == "")) {
                        var hisCallersFunction = hisCallee.caller.toString();
                        if ((hisCallersFunction !== null)) {
                            hisCallerName = fBetween(hisCallersFunction, "function", "(");
                        }
                    }
                    hisCallerName = trim(hisCallerName);
                }
                catch (ex) {

                }

                if (hisCallerName === null) {
                    return "(anonymous)";
                }   
                console.warn(hisCallerName);

                return hisCallerName;
            }
        </script>
    </body>
</html> 