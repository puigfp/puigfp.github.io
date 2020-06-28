# std
import random

# 3p
import pytest

# local
from kmp import kmp_search, naive_search, str_find_search


@pytest.mark.parametrize(
    "search_func",
    [kmp_search, naive_search, str_find_search],
    ids=["kmp", "naive", "str.find"],
)
@pytest.mark.parametrize(
    "p,t,expected",
    [
        ("a", "", None),
        ("a", "a", 0),
        ("aaaaaab", "aaaaaaaabaaa", 2),
        ("aab", "acaaab", 3),
        ("ababc", "abababc", 2),
    ],
)
def test_basic(search_func, p, t, expected):
    assert search_func(p, t) == expected


def test_random():
    for _ in range(50):
        p, t = (
            "".join(random.choice("abc") for _ in range(random.randint(1, 10))),
            "".join(random.choice("abc") for _ in range(random.randint(0, 100))),
        )
        # check that all 3 functions agree
        assert kmp_search(p, t) == naive_search(p, t) == str_find_search(p, t)
