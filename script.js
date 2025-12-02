
        // Job Applications Config (false)  true
        const jobConfig = {
            police: { open: true, webhook: "https://discord.com/api/webhooks/1435867133228617849/3buEvf_ztwDgLqVEaiDUkzE_pHYkDJzo0TcBkZmIfIiY-Bz19nQoKzqAln5mq6TKFBV2" },
            ems: { open: true, webhook: "https://discord.com/api/webhooks/1435867889709355088/Y2me60fLf9MZuS7ZKCrsnytdj3_0bLWaNdWD8QI1doSlzHOxPY3uvzlrJKR0OTtnj5xY" },
            justice: { open: true, webhook: "https://discord.com/api/webhooks/1435868268685692998/AHbze2KVpnvwZuUO2DTB_ns96Zasd9ZFhUUqS8KdUcvtxCxZvbCvvjwLbcy18N49NjUI" }
        };

        // Show Page Function
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });

            const navLinks = document.querySelectorAll('.nav-links a');
            for (let i = 0; i < navLinks.length; i++) {
                if (navLinks[i].getAttribute('onclick') === `showPage('${pageId}')`) {
                    navLinks[i].classList.add('active');
                    break;
                }
            }
            window.scrollTo(0, 0);
        }

        // Show Law Section Function
        function showLawSection(sectionId) {
            document.querySelectorAll('.law-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');

            document.querySelectorAll('.law-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            const lawBtns = document.querySelectorAll('.law-btn');
            for (let i = 0; i < lawBtns.length; i++) {
                if (lawBtns[i].getAttribute('onclick') === `showLawSection('${sectionId}')`) {
                    lawBtns[i].classList.add('active');
                    break;
                }
            }
        }

        // Collapse/Expand for Law Sections
        document.querySelectorAll('.collapse-btn').forEach(button => {
            button.addEventListener('click', function () {
                this.classList.toggle('active');
                const content = this.nextElementSibling;

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    content.classList.remove('show');
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.classList.add('show');
                }
            });
        });

        // Job Application Modal Functions
        function openJobModal(jobType) {
            if (!jobConfig[jobType].open) {
                showNotification('التقديم مغلق حالياً', true);
                return;
            }

            document.getElementById('job-type').value = jobType;
            document.getElementById('modal-title').textContent = `تقديم ${getJobTitle(jobType)}`;
            document.getElementById('job-modal').classList.add('active');

            if (jobType === 'justice') {
                document.getElementById('justice-role-group').style.display = 'block';
                document.getElementById('justice-role').setAttribute('required', 'true');
            } else {
                document.getElementById('justice-role-group').style.display = 'none';
                document.getElementById('justice-role').removeAttribute('required');
            }
        }

        function closeModal() {
            document.getElementById('job-modal').classList.remove('active');
            document.getElementById('job-form').reset();
        }

        function getJobTitle(jobType) {
            switch (jobType) {
                case 'police': return 'LSPD';
                case 'ems': return 'EMS';
                case 'justice': return 'Justice';
                default: return 'وظيفة';
            }
        }

   


        // Notification Function
        function showNotification(message, isError = false) {
            const notification = document.getElementById('notification');
            const notificationMsg = document.getElementById('notification-message');

            notificationMsg.textContent = message;

            if (isError) {
                notification.classList.add('error');
            } else {
                notification.classList.remove('error');
            }

            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }

        // Form Submission
        document.getElementById('job-form').addEventListener('submit', function (e) {
            e.preventDefault();

            const jobType = document.getElementById('job-type').value;
            const characterName = document.getElementById('character-name').value;
            const characterId = document.getElementById('character-id').value;
            const phoneNumber = document.getElementById('phone-number').value;
            const discordUser = document.getElementById('discord-user').value;

            let jobTitle = getJobTitle(jobType);

            if (jobType === 'justice') {
                const justiceRole = document.getElementById('justice-role').value;
                if (!justiceRole) {
                    showNotification('الرجاء اختيار التخصص (محامي أو قاضي)', true);
                    return;
                }
                jobTitle = `Justice - ${justiceRole}`;
            }

            const webhookUrl = jobConfig[jobType].webhook;

           const roleId = "1389545718187823104"; // هنا تحط ID الرتبة

    const data = {
        content: `@here`, // يسوي منشن @here
        embeds: [
            {
                title: ` تقديم وظيفة `,
                description: `**تم استلام طلب تقديم جديد!**\n\nيرجى من **فريق الإدارة** مراجعة التفاصيل أدناه واتخاذ الإجراء المناسب ✅`,
                color: 0xff7f50,
                thumbnail: {
                    url: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                },
                fields: [
                    { name: "💼 الوظيفة", value: `\`\`\`${jobTitle}\`\`\``, inline: false },
                    { name: "🪪 الاسم", value: `\`\`\`${characterName}\`\`\``, inline: true },
                    { name: "🆔 رقم الهوية", value: `\`\`\`${characterId}\`\`\``, inline: true },
                    { name: "📱 الجوال", value: `\`\`\`${phoneNumber}\`\`\``, inline: true },
                    { name: "💬 الديسكورد", value: `\`\`\`${discordUser}\`\`\``, inline: true }
                ],
                footer: {
                    text: `🔔 نظام التقديمات | سيرفر فايف إم `,
                    icon_url: "https://cdn-icons-png.flaticon.com/512/906/906361.png"
                },
                timestamp: new Date()
            }
        ]
    };

            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
                .then(response => {
                    if (response.ok) {
                        showNotification('تم ارسال تقديمك وستصلك رسالة القبول بالدسكورد');
                        closeModal();
                    } else {
                        showNotification('حدث خطأ أثناء إرسال التقديم', true);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('حدث خطأ أثناء إرسال التقديم', true);
                });
        });

        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.law-section.active .collapse-container:first-child .collapse-btn').forEach(btn => {
                btn.click();
            });
        });





    