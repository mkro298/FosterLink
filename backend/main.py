import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc

app = Flask(__name__, static_folder='frontend/build', static_url_path='/')
CORS(app, resources={r"/*": {"origins": "https://fosterlinkapp.azurewebsites.net"}})

# Connection string for Azure SQL database with SQL Authentication
# SQL auth pass: Quadrant123
connection_string = (
    "Driver={ODBC Driver 18 for SQL Server};"
    "Server=tcp:fosterlinkdb.database.windows.net,1433;"
    "Database=fosterlinkdb;"
    "Uid=fosterlink;"
    "Pwd=Quadrant123;"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
    "Connection Timeout=20;"
)

# Function to connect to the database
def connect_to_database():
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        return conn, cursor
    except Exception as e:
        return None, str(e)
    
# Function to close the database connection
def close_connection(conn, cursor):
    cursor.close()
    conn.close()

# API endpoint to insert user data into the database, into the Users table
@app.route('/new_user', methods=['POST'])
def create_new_user():
    try:
        data = request.get_json()
        conn, cursor = connect_to_database()
        if conn is None:
            return jsonify({"status": "error", "message": cursor}), 500  # cursor contains the error message
        sha256_hash = hashlib.sha256(data['password'].encode()).hexdigest()
        try:
            if data['isStudent']:
                cursor.execute(
                    "INSERT INTO Students (FirstName, LastName, Email, PasswordHash) VALUES (?, ?, ?, ?);",
                    (data['first_name'], data['last_name'], data['email'], sha256_hash)
                )
            else:
                cursor.execute(
                    "INSERT INTO Mentors (FirstName, LastName, Email, PasswordHash, Availability, HourlyRate, Subjects) "
                        "VALUES (?, ?, ?, ?, ?, ?, ?);",
                    (data['first_name'], data['last_name'], data['email'], sha256_hash, 
                        data['availability'], data['rate'], data['subjects'])
                )
            conn.commit()
        except pyodbc.IntegrityError as e:
            # Check if the email exists in the database already
            if '23000' in str(e):
                return jsonify({"status": "error", "message": "Email already exists, please use a different email"}), 400
            else:
                raise
        
        close_connection(conn, cursor)
        return jsonify({"status": "success", "message": "User registered successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# API endpoint to authenticate a user logging in
@app.route('/login', methods=['POST'])
def user_login():
    try:
        data = request.get_json()
        conn, cursor = connect_to_database()
        if conn is None:
            return jsonify({"status": "error", "message": cursor}), 500  # cursor contains the error message
        sha256_hash = hashlib.sha256(data['password'].encode()).hexdigest()
        cursor.execute(
            "SELECT * FROM Students WHERE Email = ? AND PasswordHash = ?;",
            (data['email'], sha256_hash)
        )
        user = cursor.fetchone()
        if not user:
            cursor.execute(
                "SELECT * FROM Mentors WHERE Email = ? AND PasswordHash = ?;",
                (data['email'], sha256_hash)
            )
            user = cursor.fetchone()
        close_connection(conn, cursor)
        if user:
            return jsonify({"status": "success", "message": "Login successful", "username": user[1] + "_" + user[2], "email": user[0]}), 200
        return jsonify({"status": "error", "message": "Invalid credentials"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# API endpoint to pull data when loading community page
# Pulls all posts and comments by the user
# Assumes that userID is the email of the user
@app.route('/my_posts', methods=['POST'])
def pull_user_posts():
    try:
        data = request.get_json()
        conn, cursor = connect_to_database()
        if conn is None: 
            return jsonify({"status" : "error", "message" : cursor}), 500 # cursor contains the error message
        cursor.execute(
            "SELECT * FROM Posts WHERE Email = ?;",
            (data['userID'])
        )
        stored_posts = cursor.fetchall()
        posts = []
        for row in stored_posts:
            posts.append({"id": row[0], "username": row[1], "title": row[2], "content": row[3], "date": row[4], "upvotes": row[5], "downvotes": row[6], "file": row[7], "userID": row[8]})
        cursor.execute(
            "SELECT * FROM replies;"
        )
        stored_replies = cursor.fetchall()
        replies = {}
        for row in stored_replies:
            post_id = row[1]
            if post_id not in replies:
                replies[post_id] = []
            replies[post_id].append({
                "id": row[0],
                "text": row[3],
                "likes": row[5],
                "dislikes": row[6],
                "username": row[2]
            })
        close_connection(conn, cursor)
        if posts:
            return jsonify({"status": "success", "posts": posts, "replies": replies}), 200
        return jsonify({"status": "error", "message" : "Error with pulling from database"}), 400
    except Exception as e: 
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/pull_all', methods=['POST'])
def pull_all_posts():
    try:
        data = request.get_json()
        conn, cursor = connect_to_database()
        if conn is None: 
            return jsonify({"status" : "error", "message" : cursor}), 500 # cursor contains the error message
        cursor.execute(
            "SELECT * FROM Posts;"
        )
        stored_posts = cursor.fetchall()
        posts = []
        for row in stored_posts:
            posts.append({"id": row[0], "username": row[1], "title": row[2], "content": row[3], "date": row[4], "upvotes": row[5], "downvotes": row[6], "file": row[7], "userID": row[8]})

        cursor.execute(
            "SELECT * FROM replies;"
        )
        stored_replies = cursor.fetchall()
        replies = {}
        for row in stored_replies:
            post_id = row[1]
            if post_id not in replies:
                replies[post_id] = []
            replies[post_id].append({
                "id": row[0],
                "text": row[3],
                "likes": row[5],
                "dislikes": row[6],
                "username": row[2]
            })
        cursor.execute(
            "SELECT * FROM all_votes WHERE Email = ?;",
            (data['userID'])
        )
        stored_votes = cursor.fetchall()
        votes = {}
        for row in stored_votes:
            votes[row[1]] = row[2]
        close_connection(conn, cursor)
        return jsonify({"status": "success", "posts": posts, "replies": replies, "votes": votes}), 200
    except Exception as e: 
        return jsonify({"status": "error", "message": str(e)}), 500

# API endpoint to push data from community page to database
# Posts, Comments, Votes, Comment Votes
# Can be used to post new posts, comments, and votes, and update existing posts, 
# comments, and votes in the database
# When trying to update one of the fields (say votes), set other fields to [] in the request body
@app.route('/push', methods=['POST'])
def push_info():
    try:
        data = request.get_json()
        posts = data['posts']
        comments = data['comments']
        votes = data['userVotes']
        conn, cursor = connect_to_database()
        if conn is None:
            return jsonify({"status": "error", "message": cursor}), 500  # cursor contains the error message
        try:
            # Insert posts, comments, post votes, and comment votes into the database
            # if the id already exists, ignore the insert and move on to the next post
            # without using insert or ignore, do it with an if statement
            for post in posts:
                cursor.execute(
                    "IF NOT EXISTS (SELECT * FROM Posts WHERE id = ?) "
                    "INSERT INTO Posts (id, username, title, content, date, upvotes, downvotes, posted_file, Email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
                    (post['id'], post['id'], post['username'], post['title'], post['content'], post['date'], post['upvotes'], post['downvotes'], post['file'], post['userID'])
                    
                )
            if type(comments) == dict:
                for post, post_comments in comments.items():
                    if len(post) < 10:
                        continue
                    for comment in post_comments:
                        email = None
                        for i in range(len(comment['id'])):
                            if comment['id'][i].isalpha():
                                email = comment['id'][i:]
                                break
                        cursor.execute(
                            "IF NOT EXISTS (SELECT * FROM Replies WHERE reply_id = ?) "
                            "INSERT INTO Replies (reply_id, replied_topost_id, username, content, date, upvotes, downvotes, Email) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
                            (comment['id'], comment['id'], post, comment['username'], comment['text'], "Just now", comment['likes'], comment['dislikes'], email)
                        )
            '''
            commented out all_votes for now
            issues with the data structure, need to fix
            '''
            # print(votes)
            # if type(votes) == dict:
            #     votes = votes.items()
            #     for post, vote in votes:
            #         cursor.execute(
            #             "INSERT INTO All_Votes (Email, PostID, vote_type) VALUES (?, ?, ?);",
            #             (data['userID'], post, vote)
            #         )
            conn.commit()
        except pyodbc.IntegrityError as e:
            for post in posts:
                # first check if the user has already voted on the post
                cursor.execute(
                    "SELECT * FROM All_Votes WHERE Email = ? AND PostID = ?;",
                    (data['userID'], post['id'])
                )
                # if the user has already voted on the post, do not insert the vote again
                if cursor.fetchone():
                    continue
                cursor.execute(
                    "UPDATE Posts SET upvotes = ? WHERE id = ?;",
                    (post['upvotes'], post['id'])
                )
                cursor.execute(
                    "UPDATE Posts SET downvotes = ? WHERE id = ?;",
                    (post['downvotes'], post['id'])
                )
            if type(comments) == dict:
                comments = comments.items()
            for post_id, post_comments in comments:
                for comment in post_comments:
                    email = None
                    for i in range(len(comment['id'])):
                        if comment['id'][i].isalpha():
                            email = comment['id'][i:]
                            break
                    cursor.execute(
                        "SELECT * FROM All_Votes WHERE PostID = ? AND Email = ?;",
                        (comment['id'], email)
                    )
                    if cursor.fetchone():
                        continue
                    cursor.execute(
                        "UPDATE Replies SET upvotes = ? WHERE reply_id = ?;",
                        (comment['likes'], comment['id'])
                    )
                    cursor.execute(
                        "UPDATE Replies SET downvotes = ? WHERE reply_id = ?;",
                        (comment['dislikes'], comment['id'])
                    )
        conn.commit()
        close_connection(conn, cursor)
        return jsonify({"status": "success", "message": "Data pushed successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
