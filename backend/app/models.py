from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Association table for project members (many-to-many)
project_members = db.Table('project_members',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False, unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(512))
    projects = db.relationship('Project', backref='owner', lazy=True)
    invited_projects = db.relationship('InvitedProject', backref='invitee', lazy=True,  cascade='all, delete-orphan')
    
    google_id = db.Column(db.String(128), unique=True) 
    def __repr__(self):
        return f"<User {self.username}>"

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bugs = db.relationship('Bug', backref='project', lazy=True, cascade='all, delete-orphan')
    members = db.relationship('User', secondary=project_members, backref='collaborations')
    invites = db.relationship('InvitedProject', backref='project', lazy=True,  cascade='all, delete-orphan')
def __repr__(self):
        return f"<Project {self.title}>"

class Bug(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text ,nullable=True)
    status = db.Column(db.String(50), default="Open")  # Open, In Progress, Resolved
    priority = db.Column(db.String(50))  # Low, Medium, High
    assignee_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    assignee = db.relationship('User', backref='assigned_bugs') 
    def __repr__(self):
        return f"<Bug {self.title}>"

class InvitedProject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)   # invitee
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    def __repr__(self):
        return f"<InvitedProject user_id={self.user_id} project_id={self.project_id}>"

class Invites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 
    project_id = db.Column(db.Integer, db.ForeignKey('project.id', ondelete='CASCADE'), nullable=False)
    inviter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, ignored
    project = db.relationship('Project', backref='invite', lazy=True)
   
    inviter = db.relationship('User', foreign_keys=[inviter_id], backref='sent_invites', lazy=True)
    invitee = db.relationship('User', foreign_keys=[user_id], backref='received_invites', lazy=True)
