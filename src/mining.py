import json
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier, export_text
from mlxtend.frequent_patterns import apriori, association_rules


def main():
   import sys
   raw_input = sys.stdin.read()
   data = json.loads(raw_input)


   df = pd.DataFrame(data)


   # Garante que a coluna 'action' existe
   if 'action' not in df.columns:
       df['action'] = 0  # Dummy se não vier


   response = {}


   # --- CLUSTERING ---
   kmeans = KMeans(n_clusters=3, random_state=0).fit(
       df[['idade', 'genero', 'tipo_dia', 'tipo_uso', 'tempo_uso']]
   )
   response['clusters'] = kmeans.labels_.tolist()


   # --- CLASSIFICAÇÃO ---
   clf = DecisionTreeClassifier()
   clf.fit(df[['idade', 'genero', 'tipo_dia', 'tipo_uso']], df['action'])
   tree_text = export_text(clf, feature_names=['idade', 'genero', 'tipo_dia', 'tipo_uso'])
   response['classificacao'] = tree_text


   # --- ASSOCIAÇÃO ---
   basket = df[['genero', 'tipo_dia', 'tipo_uso']]
   onehot = pd.get_dummies(basket)
   onehot = onehot.astype(bool)  # ✅ Solução do erro de tipo


   freq_items = apriori(onehot, min_support=0.4, use_colnames=True)
   rules = association_rules(freq_items, metric='lift', min_threshold=1.0)


   # Converte conjuntos para listas (evita erro ao converter JSON)
   def convert_set(obj):
       return list(obj) if isinstance(obj, frozenset) else obj


   response['associacoes'] = [
       {
           'antecedents': convert_set(row['antecedents']),
           'consequents': convert_set(row['consequents']),
           'support': row['support']
       }
       for _, row in rules.iterrows()
   ]


   print(json.dumps(response, indent=2, default=str))




if __name__ == "__main__":
   main()
