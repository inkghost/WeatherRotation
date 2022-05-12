import os
import csv

# csv 文件目录
raw_dir = '.\\raw\\'
processed_dir = '.\\processed\\'

# 原始文件
raw_files = []

# 提取列
row_header_list = ['NAME', 'DATE', 'TEMP', 'MAX', 'MIN', 'PRCP']
processed_header_list = ['NAME', 'DATE', 'TAVG', 'TMAX', 'TMIN', 'PRCP']


# 华氏度转摄氏度
def fah2cel(value):
    f = float(value)
    c = (f - 32) / 1.8
    return round(c, 2)


# 数据处理
def process(file):
    with open(raw_dir + file, 'r') as r_f, open(processed_dir + file, 'w', newline="") as w_f:
        reader = csv.DictReader(r_f)
        writer = csv.writer(w_f)
        writer.writerow(processed_header_list)

        for row in reader:
            writer.writerow([row[row_header_list[0]],
                             row[row_header_list[1]],
                            fah2cel(row[row_header_list[2]]),
                            fah2cel(row[row_header_list[3]]),
                            fah2cel(row[row_header_list[4]]),
                             row[row_header_list[5]]])


def main():
    raw_files = os.listdir(raw_dir)
    for file in raw_files:
        process(file)


if __name__ == '__main__':
    main()
