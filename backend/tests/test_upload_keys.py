import pytest
from pydantic import ValidationError

from app.api.v1.endpoints.uploads import PresignRequest
from app.core.r2 import build_object_key

SHA = "a" * 64


def test_key_uses_content_hash_so_reuploads_share_a_url():
    assert build_object_key("image/jpeg", sha256=SHA) == f"properties/{SHA}.jpg"
    assert build_object_key("image/jpeg", sha256=SHA) == build_object_key("image/jpeg", sha256=SHA)


def test_key_without_hash_stays_random_for_older_callers():
    a = build_object_key("image/png")
    b = build_object_key("image/png")
    assert a != b
    assert a.startswith("properties/") and a.endswith(".png")


@pytest.mark.parametrize("bad", ["A" * 64, "a" * 63, "../" + "a" * 61, "g" * 64])
def test_presign_rejects_anything_but_lowercase_hex_sha256(bad):
    # The hash becomes an object key, so it must never carry a path or odd characters.
    with pytest.raises(ValidationError):
        PresignRequest(content_type="image/jpeg", sha256=bad)
