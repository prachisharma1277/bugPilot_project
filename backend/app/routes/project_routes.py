from flask import Blueprint, request, jsonify
from app.models import Project,User,InvitedProject,Invites, db
from flask_cors import cross_origin
import os
project_bp = Blueprint('project_bp', __name__)

@project_bp.route('/<int:project_id>/invite', methods=['POST'])
@cross_origin(origins=[os.getenv("FRONTEND_URL")])
def invite_member(project_id):
    data = request.get_json()
    inviter_id = data.get("owner_id")  # current logged-in user
    invitee_email = data.get("invite_email")

    project = Project.query.get(project_id)
    if not project or project.user_id != inviter_id:
        return jsonify({"error": "Only owner can invite"}), 403

    user_to_invite = User.query.filter_by(email=invitee_email).first()
    if not user_to_invite:
        return jsonify({"error": "User not found"}), 404

    if user_to_invite in project.members:
        return jsonify({"message": "User already a member"}), 200

    # Check if already invited
    existing_invite = Invites.query.filter_by(
        user_id=user_to_invite.id, project_id=project.id, inviter_id=inviter_id, status='pending'
    ).first()
    if existing_invite:
        return jsonify({"message": "Invite already sent"}), 200

    # Create invite
    invited = Invites(user_id=user_to_invite.id, project_id=project.id, inviter_id=inviter_id)
    db.session.add(invited)
    db.session.commit()

    return jsonify({"message": "Invite sent successfully"}), 201

@project_bp.route('/<int:project_id>/remove', methods=['POST'])
def remove_member(project_id):
    data = request.get_json()
    
    remover_id = data.get("owner_id")
    user_id_to_remove = data.get("remove_user_id")
  
    project = Project.query.get(project_id)
    if not project or project.user_id != remover_id:
        return jsonify({"error": "Only owner can remove"}), 403

    user_to_remove = User.query.get(user_id_to_remove)
    if user_to_remove not in project.members:
        return jsonify({"error": "User not in team"}), 400

    # Remove from project members
    project.members.remove(user_to_remove)

    # ❗ Also remove from InvitedProject
    invited = InvitedProject.query.filter_by(user_id=user_id_to_remove, project_id=project_id).first()
    if invited:
        db.session.delete(invited)

    db.session.commit()
    return jsonify({"message": "User removed from project"})

    


@project_bp.route('/<int:project_id>/members', methods=['GET'])
def get_project_members(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    members = [{
        "id": member.id,
        "username": member.username,
        "email": member.email,
        "role": "member"
    } for member in project.members]

    # Add the owner
    if project.owner:
        members.insert(0, {
            "id": project.owner.id,
            "username": project.owner.username,
            "email": project.owner.email,
            "role": "owner"
        })

    return jsonify(members)

@project_bp.route('/invites/<int:user_id>', methods=['GET'])
def get_invites(user_id):
    invites = Invites.query.filter_by(user_id=user_id, status='pending').all()
    return jsonify([{
        'id': i.id,
        'project_id': i.project_id,
        'project_name': i.project.title,
        'inviter_name': i.inviter.username
    } for i in invites])


@project_bp.route('invites/respond', methods=['POST'])
def respond_invite():
    data = request.get_json()
    invite = Invites.query.get(data['invite_id'])

    if not invite or invite.user_id != data['user_id']:
        return jsonify({'error': 'Unauthorized or invalid invite'}), 403

    if data['action'] == 'accept':
        invite.status = 'accepted'
        project = Project.query.get(invite.project_id)
        project.members.append(invite.invitee)
        invited = InvitedProject(user_id=invite.user_id, project_id=project.id)
        db.session.add(invited)
    else:
        invite.status = 'ignored'

    db.session.commit()
    return jsonify({'message': f"Invite {data['action']}ed."})




@project_bp.route('/invited/<int:user_id>', methods=['GET'])
def get_invited_projects(user_id):
    invited_entries = InvitedProject.query.filter_by(user_id=user_id).all()
    projects = [
        {
            "id": entry.project.id,
            "title": entry.project.title,
            "owner_id": entry.project.user_id
        }
        for entry in invited_entries
    ]
    return jsonify(projects)

@project_bp.route('/<int:user_id>', methods=['GET'])
def get_projects(user_id):
    projects = Project.query.filter_by(user_id=user_id).all()
    return jsonify([
        {"id": p.id, "title": p.title, "user_id": p.user_id} for p in projects
    ])
    

@project_bp.route('/create', methods=['POST', 'OPTIONS'])
@cross_origin(origins=[os.getenv("FRONTEND_URL")], supports_credentials=True)
def create_project():
    if request.method == "OPTIONS":
        print("OPTIONS preflight received")
        return jsonify({"message": "Preflight OK"}), 200

    print("Project Create route hit!")

    try:
        print("Headers:", request.headers)
        print("Is JSON:", request.is_json)

        data = request.get_json(force=True)
        print("Received data:", data)

        title = data.get("title")
        user_id = data.get("user_id")

        print("Parsed title:", title)
        print("Parsed user_id:", user_id)

        if not title or not user_id:
            return jsonify({"error": "Title and user_id required"}), 400

        new_project = Project(title=title, user_id=user_id)
        db.session.add(new_project)
        db.session.commit()

        return jsonify({"message": "Project created successfully"}), 201

    except Exception as e:
        print("Error in create_project:", str(e))
        return jsonify({"error": str(e)}), 500
    
@project_bp.route('/delete/<int:project_id>', methods=["DELETE", "OPTIONS"])
@cross_origin(origins=[os.getenv("FRONTEND_URL")], supports_credentials=True)
def delete_project(project_id):
    if request.method == "OPTIONS":
        # Return a simple 200 OK for preflight
        return '', 200

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"message": "Project not found"}), 404
    Invites.query.filter_by(project_id=project.id).delete()
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted successfully"}), 200
