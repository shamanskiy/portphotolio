from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/white_sea')
def white_sea():
    return render_template("white_sea.html")

@app.route('/crimea')
def crimea():
    return render_template("crimea.html")

@app.route('/test')
def test():
    return render_template("test.html")

if __name__ == "__main__":
    app.run(debug=True)
    #app.run(host='192.168.0.4',port = "5010")
