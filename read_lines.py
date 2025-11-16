with open("g:\\fares project\\src\\components\\sections\\CardsSection.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Print lines 144-149
for i in range(144, 150):
    print(f"{i}: {repr(lines[i])}")