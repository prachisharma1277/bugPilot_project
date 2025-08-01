from flask import Blueprint, request, jsonify
from app import db
from app.models import User, Bug,Project

bug_bp = Blueprint('bugs', __name__)

@bug_bp.route('/<int:project_id>', methods=['GET'])
def get_all_bugs(project_id):
    bugs = Bug.query.filter_by(project_id=project_id).all()
    return jsonify([
        {
            "id": bug.id,
            "title": bug.title,
            "status": bug.status,
            "description":bug.description,
            "priority": bug.priority,
            "assignee_id": bug.assignee_id,
            "assignee": bug.assignee.username if bug.assignee else None
        } for bug in bugs
    ])


@bug_bp.route('/<int:project_id>', methods=['POST'])
def get_bugs(project_id):
    data = request.get_json()
    user_id = data.get("user_id")

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Access control
    if project.user_id != user_id and not any(member.id == user_id for member in project.members):
        return jsonify({"error": "Not authorized"}), 403

    bugs = Bug.query.filter_by(project_id=project_id).all()
    return jsonify([...])

@bug_bp.route("/<int:bug_id>", methods=["DELETE"])
def delete_bug(bug_id):
    bug = Bug.query.get(bug_id)
    if not bug:
        return jsonify({"error": "Bug not found"}), 404

    try:
        db.session.delete(bug)
        db.session.commit()
        return jsonify({"message": "Bug deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bug_bp.route('/create', methods=['POST'])
def create_bug():
    data = request.json
    assignee = User.query.filter_by(username=data['assignee']).first()

    if not assignee:
        return jsonify({"error": "Assignee not found"}), 404
    new_bug = Bug(
        title=data['title'],
        status=data['status'],
        priority=data['priority'],
        assignee_id=assignee.id,
        description=data['description'],
        project_id=data['project_id']
    )
    db.session.add(new_bug)
    db.session.commit()
    return jsonify({"message": "Bug created", "bug_id": new_bug.id})
