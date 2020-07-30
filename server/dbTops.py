from sqlalchemy import MetaData, Table, Column, String, Integer
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
import sqlalchemy as db
import psycopg2

SERVER = 'localhost:5432'
DATABASE = 'UserTops'
USERNAME = 'postgres'
PASSWORD = 'dbisadbdev'
DATABASE_CONNECTION = f'postgresql+psycopg2://{USERNAME}:{PASSWORD}@{SERVER}/{DATABASE}'

class Database():
    #create DB connection string with user:pw@server/dbname
    engine = db.create_engine(DATABASE_CONNECTION)

    def __init__(self):
        #establishes connection when this database class is created wherever used.
        self.connection = self.engine.connect()
        print("Database Instance created")

    def saveData(self, uri):
        session = Session(bind=self.connection)
        session.add(uri)
        session.commit()
        print("track committed")

    def fetchUserByName(self, table_name):
        meta = MetaData()
        item = Table(table_name, meta,
                        Column('spotify_uri'),
                        Column('rank'),
                        Column('user_id'))
        data = self.connection.execute(item.select())
        for d in data:
            print(d)

    def fetchAllUsers(self, class_name):
        # bind an individual Session to the connection
        self.session = Session(bind=self.connection)
        items = self.session.query(class_name).all()
        for i in items:
            print(i)

    def fetchByQuery(self, query):
        fetchQuery = self.connection.execute(f"SELECT * FROM {query}")

        for data in fetchQuery.fetchall():
            print(data)

    # def updateUser(self, userID, class_name, address):
    #     session = Session(bind=self.connection)
    #     dataToUpdate = {class_name.address: address}
    #     userData = session.query(class_name).filter(class_name.user_id==userID)
    #     userData.update(dataToUpdate)
    #     session.commit()

    def deleteArtistUser(self, userID):
        session = Session(bind=self.connection)
        i = session.query(Artist).filter(Artist.user_id==userID)
        session.delete(i)
        session.commit()

    def deleteTrackUser(self, userID):
        session = Session(bind=self.connection)
        i  = session.query(Track).filter(Track.user_id==userID)
        session.delete(i)
        session.commit()

    def userArtistExists(self, userID):
        session = Session(bind=self.connection)
        return len(session.query(Artist).filter(Artist.user_id==userID).all()) > 0

    def userTrackExists(self, userID):
        session = Session(bind=self.connection)
        return len(session.query(Track).filter(Track.user_id==userID).all()) > 0

Base = declarative_base()

class Artist(Base):
    """Model for top artists table."""
    __tablename__ = 'artists'
    id = Column(Integer, primary_key=True)
    spotify_uri = Column(String)
    rank = Column(Integer)
    user_id = Column(Integer)

    def __repr__(self):
        return "<User(spotify_uri='%s', rank='%s', user_id='%s')>" % (self.spotify_uri, self.rank, self.user_id)

class Track(Base):
    """Model for top tracks table."""
    __tablename__ = 'tracks'
    id = Column(Integer, primary_key=True)
    spotify_uri = Column(String)
    rank = Column(Integer)
    user_id = Column(Integer)

    def __repr__(self):
        return "<User(spotify_uri='%s', rank='%s', user_id='%s')>" % (self.spotify_uri, self.rank, self.user_id)
