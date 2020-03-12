

textbox = document.getElementById("formulabox");

/*
    Simple calculator that evaluates expressions using the shunting yard algorithm
    Text is entered using the buttons or keyboard input then parsed when the user hits enter
*/
var calc = {
    text: textbox.value,
    // List of characters that can be typed into the text box.
    validChars: [")", "(", "^", "*", "/", "+", "-", ".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    numberChars: [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    operators: [")", "(", "^", "*", "/", "+", "-"],
    operatorPrecedence: {"+": 1, "-": 1, "*": 2, "/": 2, "^": 3},

    updateTextBox: function(t) {
        textbox.value = t;
        this.printTextValue();
    },

    printTextValue: function() {
        console.log("Text: " + this.text);
    },

    // Return a boolean value representing whether or not the expression can be evaluated properly.
    // E.g. 1+2 can be evaluated, 1++2 cannot, 1.5.5+1 cannot, 1+-4 can (Maybe only implement the binary operators or insert () first. IDK...)
    validate: function(expr) {

    },

    tokenize: function(expr) {
        var start = 0, end = 0;
        var tokens = [];
        console.log(expr);
        var lastCharOp = true;

        while (end < expr.length) {
            // Grab numbers.
            if (this.numberChars.includes(expr[end]) || (lastCharOp && expr[end] === "-")) {
                while (this.numberChars.includes(expr[end]) || (lastCharOp && expr[end] === "-")) { 
                    end++;
                    lastCharOp = false;
                }
                console.log("Pushing a number at " + start + " " + end);
                tokens.push(expr.substring(start, end));
            }
            
            // Grab operators.
            if (this.operators.includes(expr[end])) {
                console.log("Pushing operator at " + end + " " + (end + 1));
                tokens.push(expr.substring(end, ++end));
                lastCharOp = true;
            }
            
            start = end;
            console.log(tokens);
        }
        return tokens;
    },

    opPrec: function(op) {
        return this.operatorPrecedence[op];
    },

    // Returns a list of operators and operands in reverse polish notation.
    shuntingYard: function(expr) {
        tokens = this.tokenize(expr);
        var opStack = [];
        var outputQueue = [];

        while (tokens.length > 0) {
            var token = tokens.shift(); // Remove element from the beginning.
            // If token is a number add it to the queue
            if (this.numberChars.includes(token[0]) || (token.length >= 2 && token[0] === "-" && this.numberChars.includes(token[1]))) {
                console.log("Pushing " + token + " into the output queue");
                outputQueue.push(token);
            }
            else if (token[0] === "(") {
                console.log("Pushing ( onto the operator stack");
                opStack.push(token);
            }
            else if (token[0] === ")") {
                while (opStack[opStack.length - 1] !== "(") {
                    var o = opStack.pop();
                    console.log("Pushing " + o + " into the output queue");
                    outputQueue.push(o);
                }
                opStack.pop();
            }
            // Otherwise it is an operator; check precedence.
            else {
                while (opStack.length > 0 && this.opPrec(token) < this.opPrec(opStack[opStack.length - 1])) {
                    var o = opStack.pop();
                    console.log("Pushing " + o + " into the output queue");
                    outputQueue.push(o);
                }
                console.log("Pushing " + token + " onto the operator stack");
                opStack.push(token);
            }
                
        }
        while (opStack.length > 0) {
            var o = opStack.pop();
            console.log("Pushing " + o + " into the output queue");
            outputQueue.push(o);
        }
            

        console.log("Output queue: " + outputQueue);
        return outputQueue;
    },

    evaluate: function() {
        
        var reversePolish = this.shuntingYard(this.text);
        console.log("Evaluating " + reversePolish);
        var s = [];

        while (reversePolish.length > 0) {
            var t = reversePolish.shift();
            if (this.numberChars.includes(t[0]) || (t.length >= 2 && t[0] === "-" && this.numberChars.includes(t[1])))
                s.push(t);
            else {
                var b = parseFloat(s.pop()); // a <op> b.
                var a = parseFloat(s.pop());
                var result = 0;
                if (t === "+")
                    result = a + b;
                else if (t === "-")
                    result = a - b;
                else if (t === "*")
                    result = a * b;
                else if (t === "/")
                    result = a / b;
                else if (t === "^")
                    result = Math.pow(a, b);

                s.push(result.toString());
            }
        }

        console.log(s[0]);
        this.text = s[0].toString();
        this.updateTextBox(this.text);

    },

    textKeyPress: function(e) {
        if (e.key === "Escape") {
            this.clearText();
            return false;
        }
        else if (e.key === "Backspace") {
            this.backspace();
            return false;
        }
        else if (e.key === "Enter") {
            this.evaluate(this.text);
            return false;
        }
    
        console.log(e.key);
        if (this.validChars.includes(e.key)) {
            this.text = this.text + e.key;
            this.updateTextBox(this.text);
            return true;
        }

    },

    addText: function(t) {
        if (this.text === "0")
            this.text = "";
        this.text = this.text + t;
        this.updateTextBox(this.text);
        this.printTextValue();
    },

    clearText: function() {
        console.log("Clearing the text field");
        this.text = "";
        this.updateTextBox(this.text);
        this.printTextValue();
    },

    backspace: function() {
        this.text = this.text.substring(0, this.text.length - 1);
        this.updateTextBox(this.text);
        this.printTextValue();
    },

    toggleSign: function() {
        if (this.text[0] == "-")
            this.text = this.text.substring(1, this.text.length);
        else
            this.text = "-" + this.text;
        this.updateTextBox(this.text);
    },

    /*
.oneDiv()'>1/x</button>
                <button id="exp" onclick='calc.addText("^")'>^</button>
                <button id="div" onclick='calc.sqrt()'>
    */

    oneDiv: function() {
        this.text = "1/(" + this.text + ")";
        this.evaluate();
    },

    sqrt: function() {
        var n = parseFloat(this.text);
        this.text = Math.sqrt(n);
        this.updateTextBox(this.text);
    },

    test: function() {
        var tests = ["1+2", "1.5-3", "2*-4", "-10/2", "-4.5/9", "10-5*-2"];
        tests.forEach(this.tokenize, this);
    }
}


textbox.addEventListener("keydown", function(event) { calc.textKeyPress(event); });