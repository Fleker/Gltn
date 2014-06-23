function InitPanelSsheetUnits() {
	//Constants
	Spreadsheet.EARTHG = 9.80665;
	SpreadsheetAPI.EARTHG = {id: “Earth’s Gravity”,
	   tags: “gravity earth”, 
	   cmd: “EARTHG”,
	   param: [],
	   des: “Returns standard gravity on Earth, 9.80665 m/s/s”};

	Spreadsheet.MOONG = 1.622;
	SpreadsheetAPI.MOONG = {id: “Moon’s Gravity”, 
	   tags: “gravity moon”,
	   cmd: “MOONG”,
	   param: [],
	   des:”Returns standard gravity on the moon, 1.662 m/s/s”};

	Spreadsheet.MARSG = 3.711;
	SpreadsheetAPI.MARSG = {id: “Mars’s Gravity,
	   tags: “gravity mars”,
	   cmd: “MARSG”,
	   param: [],
	   des:”Returns standard gravity on Mars, 3.711 m/s/s”};

	Spreadsheet.JUPITERG = 24.79
    SpreadsheetAPI.JUPITERG = {id:”Jupiter’s Gravity,
	   tags: “gravity jupiter”,
	   cmd: “JUPITERG”,
	   param: [],
	   des:”Returns standard gravity on Jupiter, 24.79 m/s/s”};

	/** Conversions - DEGREES ***/
	Spreadsheet.degToRad = function(d) {
		return d/180*Math.PI;
    }
    SpreadsheetAPI.degToRad = {id: “Degree to Radians”,
                            tags: “degrees radians degtorad”,
                            cmd: “degToRad(d)”,
                            param:[{id:”d”, des:”The number of degrees”}],
                            des:”Converts degrees to radians”};

    Spreadsheet.radToDeg = function(r) {
        return r/Math.PI*180;
    }
    SpreadsheetAPI.radToDeg = {id: “Radians to Degrees”,
                                tags: “degrees radians radtodeg”,
                                cmd: “degToRad(d)”,
                                param:[{id:”d”, des:”The number of degrees”}],
                                des:”Converts degrees to radians”};
	
    /** Conversions - LENGTH ***/
    Spreadsheet.cmToInch = function(cm) {
        return cm/2.54;   
    }
    SpreadsheetAPI.cmToInch = {id: "Centimeters to Inches",
                                tags: "centimeters inches cmtoinch",
                                cmd: "cmToInch(cm)",
                                param:[{id:"cm", des:"The length in centimeters"}],
                                des:"Converts centimeters to inches"};
    Spreadsheet.inchToCm = function(inch) {
        return inch*2.54;   
    }
    SpreadsheetAPI.inchToCm = {id: "Inches to Centimeters",
                                tags: "centimeters inches inchtocm",
                                cmd: "inchToCm(inch)",
                                param:[{id:"inch", des:"The length in inches"}],
                                des:"Converts inches to centimeters"};

    /** Conversions - TEMPERATURE ***/
    Spreadsheet.CtoK = function(celcius) {
        return celcius - 273;
    }
    SpreadsheetAPI.CtoK = {id:"Celcius to Kelvin",
                            tags:"celcius kelvin temperature ctok",
                            cmd:"CtoK(celcius)",
                            param:[{id:"celcius", des:"The temperature in celcius"}],
                            des:"Converts degrees Celcius to Kelvin"};
    Spreadsheet.FtoC = function(fah) {
        return (fah-32)*5/9;   
    }
    SpreadsheetAPI.FtoC = {id:"Fahrenheit to Celcius",
                            tags:"fahrenheit celcius ftoc",
                            cmd:"FtoC(fahrenheit)",
                            param:[{id:"fahrenheit", des:"The temperature in fahrenheit"}],
                            des:"Converts degrees Fahrenheit to degrees Celcius"};
}
