from graph import graph

response = graph.invoke(
    {
        "name": "Test User",
        "email": "test@gmail.com",
        "notes": "Customer wants a demo of AI CRM next week"
    }
)

print(response)