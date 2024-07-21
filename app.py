from flask import Flask, render_template


app= Flask(__name__)

@app.route('/welcome')
def intr():
    return render_template(
        'intro_vares.html',
    )

@app.route('/index')
def index():
    return render_template(
        'index_vares.html',
    )

    
@app.route('/cards')
def cards():
    return render_template('cards_vares.html')


@app.route('/login')
def login():
    return render_template(
        'login_vares.html',
    )
    
@app.route('/shop')
def shop():
    return render_template(
        'shop_vares.html',
    )
    
