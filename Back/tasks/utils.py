
def sorted_by_status(item):
    # ordena as tarefas baseado no status como na lista abaixo
    key = ['1', '2', '3', '4', '0']  # lista de status na ordem a ser organizada
    return key.index(item["status"])
