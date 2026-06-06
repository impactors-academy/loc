def test_list_properties_empty(client):
    response = client.get("/api/v1/properties/")
    assert response.status_code == 200
    assert response.json() == []


def test_get_property_not_found(client):
    response = client.get("/api/v1/properties/nonexistent-slug")
    assert response.status_code == 404
