from flask import Flask, redirect, g, request
import psycopg2.pool

app = Flask(__name__, static_folder="public", static_url_path="")


@app.route('/')
def index():
    return redirect('/index.html')


# Setup our database SimpleConnectionPool
app.config['postgreSQL_pool'] = psycopg2.pool.SimpleConnectionPool(
    1,  # min number of connections
    10,  # max number of connections
    host='127.0.0.1',
    port='5432',
    database='pets'  # Database name - This may need to change!
)

# Function to get a connection to the DB,
# use in each route that needs to access DB


def get_db_conn():
    if 'db' not in g:
        g.db = app.config['postgreSQL_pool'].getconn()
        print('Got connection to DB!')
    return g.db

# Close db connections when done


@app.teardown_appcontext
def close_db_conn(taco):
    db = g.pop('db', None)
    if db is not None:
        app.config['postgreSQL_pool'].putconn(db)
        print('Closing connection!')

# Get all songs


@app.route('/pet', methods=['GET', 'POST'])
def petStuff():
    if request.method == 'GET':
        return getAllPets()
    elif request.method == 'POST':
        return addPet(request.form)


@app.route('/pet/<id>', methods=['PUT', 'DELETE'])
def petChange(id):
    if request.method == 'DELETE':
        return delPet(id)


def delPet(petId):
    print('Deleting pets', petId)

    cursor = None
    response = None

    try:
        # Get a connection, use that to get a cursor
        conn = get_db_conn()
        cursor = conn.cursor()

        # TODO Database INSERT
        sql = 'DELETE FROM "pets" WHERE id=%s;'
        cursor.execute(sql, (petId))

        # IMPORTANT - FOR Add, Update, Delete - Make sure to commit!!!
        conn.commit()
        response = {'msg': 'Deleted pet'}, 201

    # python equivalent of catch
    except psycopg2.Error as e:
        print('Error from DB', e.pgerror)
        response = {'msg': 'Error Adding pet'}, 500
    # python equivalent of finally
    else:
        if cursor:
            # close the cursor
            cursor.close()

    return response


def addPet(pet):
    print('Adding pets', pet)

    cursor = None
    response = None

    try:
        # Get a connection, use that to get a cursor
        conn = get_db_conn()
        cursor = conn.cursor()

        # TODO Database INSERT
        sql = 'INSERT INTO pets ("name", "breed", "color") VALUES (%s, %s, %s);'
        cursor.execute(sql, (pet['name'], pet['breed'], pet['color']))

        # IMPORTANT - FOR Add, Update, Delete - Make sure to commit!!!
        conn.commit()
        response = {'msg': 'Added pet'}, 201

    # python equivalent of catch
    except psycopg2.Error as e:
        print('Error from DB', e.pgerror)
        response = {'msg': 'Error Adding pet'}, 500
    # python equivalent of finally
    else:
        if cursor:
            # close the cursor
            cursor.close()

    return response


def getAllPets():
    # Get a connection, use that to get a cursor
    conn = get_db_conn()
    cursor = conn.cursor()

    # Run our select query
    cursor.execute('SELECT * FROM pets ORDER BY id DESC')

    # Get our results
    result = cursor.fetchall()

    # IMPORTANT! - CLOSE cursor
    cursor.close()

    # Send back results
    return {'pets': result}
