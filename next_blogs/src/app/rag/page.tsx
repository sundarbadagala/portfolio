"use client"
import Container from "@/shared/components/Container";

function Page() {
    const handleUpload = () => {
        const el = document.createElement('input')
        el.setAttribute('type', 'file')
        el.setAttribute('accept', 'application/pdf')
        el.addEventListener('change', async () => {
            const file = el.files?.[0]
            if (!file) return
            console.log(file)
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('http://localhost:8080/api/v1/upload/pdf', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            console.log(data)
        })
        el.click()

    }
    return (
        <main className="min-h-screen mt-6">
            <Container>
                <h1>Page</h1>
                <button onClick={handleUpload}>Upload</button>
            </Container>
        </main>
    );
}

export default Page;