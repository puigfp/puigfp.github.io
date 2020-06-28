def naive_search(p, t):
    for i in range(0, len(t) - len(p) + 1):
        if t[i : i + len(p)] == p:
            return i
    return None


def str_find_search(p, t):
    res = t.find(p)
    return res if res != -1 else None


def kmp_jump_table(p):
    jump = [-1] + [0] * len(p)
    j = 0
    for i in range(2, len(p) + 1):  # loop 1
        while j >= 0 and p[i - 1] != p[j]:  # loop 2
            j = jump[j]
        j += 1
        jump[i] = j
    return jump


def kmp_search(p, t):
    jump = kmp_jump_table(p)
    j = 0
    for i in range(len(t)):  # loop 1
        while j >= 0 and t[i] != p[j]:  # loop 2
            j = jump[j]
        j += 1
        if j == len(p):
            return i + 1 - len(p)
    return None


def print_state(prefix, p, t, i, j):
    print(f"{prefix}: i={i} j={j} p=[{p[:j]}]{p[j:]} t={t[:i-j]}[{t[i-j:i]}]{t[i:]}")


def kmp_search_print(p, t):
    jump = kmp_jump_table(p)
    j = 0
    for i in range(len(t)):  # loop 1
        print_state("- loop 1", p, t, i, j)
        while j >= 0 and t[i] != p[j]:  # loop 2
            print(
                f"    - loop 2: p[j] != t[i] ({p[j]} != {t[i]})"
                " => try to extend smaller prefix"
            )
            print(f"      loop 2: j = jump[{j}] = {jump[j]}")
            j = jump[j]
            if j >= 0:
                print_state("      loop 2", p, t, i, j)
            else:
                print(f"      loop 2: i={i} j={j}")
        if j >= 0:
            print(f"  loop 1: p[j] == t[i] ({p[j]} == {t[i]}) => extend matched prefix")
        else:
            print(f"  loop 1: cannot extend any prefix")
        j += 1
        if j == len(p):
            print(f"  loop 1: j == len(p) => return {i + 1 - len(p)} = i + 1 - len(p)")
            return i + 1 - len(p)
        print()
    return None
