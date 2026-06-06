def test_list_experiences_empty(client):
    response = client.get("/api/v1/experiences/")
    assert response.status_code == 200
    assert response.json() == []


def test_get_experience_not_found(client):
    response = client.get("/api/v1/experiences/nonexistent-slug")
    assert response.status_code == 404
