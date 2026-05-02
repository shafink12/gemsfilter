# Name:
# File: final.py
# Semester: Spring 2026


def calculate_tip(charge, tip_percent):
    """
    calculate_tip accepts the bill amount and the percent to tip and
    returns the amount of the tip to write into the bill.
    Returns "Invalid charge amount" if charge is not more than 0.
    Returns "Invalid tip percent" if tip_percent is less than 0.
    """
    if charge <= 0:
        return "Invalid charge amount"
    if tip_percent < 0:
        return "Invalid tip percent"
    return charge * tip_percent / 100


def classify_student(credits):
    """
    classify_student accepts an integer number of credit hours and
    returns the student's classification as a string.
    """
    if credits < 1:
        return "Insufficient credits for classification"
    if credits <= 23:
        return "Freshman"
    if credits <= 53:
        return "Sophomore"
    if credits <= 84:
        return "Junior"
    return "Senior"


def mode_central_tendency(aList):
    """
    mode_central_tendency accepts a list of values and returns a list
    containing the value(s) that occur most frequently.
    Returns an empty list if the input list is empty.
    """
    if len(aList) == 0:
        return []

    counts = {}
    for value in aList:
        if value in counts:
            counts[value] += 1
        else:
            counts[value] = 1

    highest = 0
    for value in counts:
        if counts[value] > highest:
            highest = counts[value]

    modes = []
    for value in aList:
        if counts[value] == highest and value not in modes:
            modes.append(value)

    return modes
