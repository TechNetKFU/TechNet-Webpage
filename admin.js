const container = document.getElementById("requestsContainer");
const requests = JSON.parse(localStorage.getItem("joinRequests")) || [];

if (requests.length === 0) {
    container.innerHTML = "<p style='color:rgba(255,255,255,0.6); text-align: center;'>لا توجد طلبات بعد.</p>";
}

requests.forEach((r, index) => {
    const card = document.createElement("div");
    card.className = "about-card";

    card.innerHTML = `
        <h3>${r.name}</h3>
        <p><strong>البريد الإلكتروني:</strong> ${r.email}</p>
        <p><strong>رقم الهاتف:</strong> ${r.phone || "—"}</p>
        <p><strong>القسم:</strong> ${r.department}</p>
        <p><strong>الرسالة:</strong> ${r.message || "—"}</p>
        <p><strong>التاريخ:</strong> ${r.createdAt}</p>
        <p><strong>الحالة:</strong> <span class="gradient-text">${r.status === "Approved" ? "تمت الموافقة" : "قيد الانتظار"}</span></p>
        ${r.status === "Approved"
            ? `<span class="gradient-text" style="font-weight: bold;">✓ تمت الموافقة</span>`
            : `<button class="btn btn-secondary" onclick="approve(${index})">موافقة</button>`
        }
    `;

    container.appendChild(card);
});

function approve(index) {
    const confirmApprove = confirm(
        "هل أنت متأكد أنك تريد الموافقة على هذا المتقدم وإرسال بريد القبول؟"
    );

    if (!confirmApprove) return;

    const requests = JSON.parse(localStorage.getItem("joinRequests")) || [];
    const applicant = requests[index];

    // Send email using EmailJS
    emailjs.send(
        "service_syyer1g",
        "template_ixeu5cq",
        {
            name: applicant.name,
            email: applicant.email,
            phone: applicant.phone,
            department: applicant.department
        }
    ).then(() => {
        // Update status to Approved
        applicant.status = "Approved";
        localStorage.setItem("joinRequests", JSON.stringify(requests));
        alert("تمت الموافقة على المتقدم وإرسال البريد الإلكتروني ✅");
        location.reload();
    }).catch(err => {
        alert("فشل إرسال البريد الإلكتروني ❌");
        console.error(err);
    });
}
