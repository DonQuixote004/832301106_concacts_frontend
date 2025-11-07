// 后端API基础URL - 注意：部署时需要改为实际的服务器地址
const API_BASE_URL = 'http://127.0.0.1:5000';

// DOM元素
let contactForm, contactId, nameInput, phoneInput, emailInput;
let submitBtn, cancelBtn, formTitle;
let contactsTable, contactsBody, loading, errorMessage, emptyMessage;

// 当前编辑状态
let isEditing = false;
let currentEditId = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    loadContacts();
});

// 初始化DOM元素引用
function initializeElements() {
    contactForm = document.getElementById('contact-form');
    contactId = document.getElementById('contact-id');
    nameInput = document.getElementById('name');
    phoneInput = document.getElementById('phone');
    emailInput = document.getElementById('email');
    
    submitBtn = document.getElementById('submit-btn');
    cancelBtn = document.getElementById('cancel-btn');
    formTitle = document.getElementById('form-title');
    
    contactsTable = document.getElementById('contacts-table');
    contactsBody = document.getElementById('contacts-body');
    loading = document.getElementById('loading');
    errorMessage = document.getElementById('error-message');
    emptyMessage = document.getElementById('empty-message');
}

// 设置事件监听器
function setupEventListeners() {
    contactForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
}

// 处理表单提交
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // 获取表单数据
    const contactData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim()
    };
    
    // 验证必填字段
    if (!contactData.name || !contactData.phone) {
        showError('姓名和电话是必填字段');
        return;
    }
    
    try {
        if (isEditing) {
            // 更新现有联系人
            await updateContact(currentEditId, contactData);
        } else {
            // 添加新联系人
            await addContact(contactData);
        }
        
        // 重置表单
        resetForm();
        // 重新加载联系人列表
        loadContacts();
        
    } catch (error) {
        showError('操作失败: ' + error.message);
    }
}

// 加载联系人列表
async function loadContacts() {
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`${API_BASE_URL}/contacts`);
        const result = await response.json();
        
        if (result.success) {
            displayContacts(result.data);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showError('加载联系人失败: ' + error.message);
    } finally {
        hideLoading();
    }
}

// 显示联系人列表
function displayContacts(contacts) {
    contactsBody.innerHTML = '';
    
    if (contacts.length === 0) {
        contactsTable.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }
    
    contactsTable.style.display = 'table';
    emptyMessage.style.display = 'none';
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${escapeHtml(contact.name)}</td>
            <td>${escapeHtml(contact.phone)}</td>
            <td>${escapeHtml(contact.email || '')}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editContact(${contact.id})">编辑</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">删除</button>
            </td>
        `;
        
        contactsBody.appendChild(row);
    });
}

// 添加新联系人
async function addContact(contactData) {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
        throw new Error(result.message);
    }
}

// 编辑联系人 - 填充表单
function editContact(id) {
    // 先获取联系人详情
    fetch(`${API_BASE_URL}/contacts`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const contact = result.data.find(c => c.id === id);
                if (contact) {
                    // 填充表单
                    nameInput.value = contact.name;
                    phoneInput.value = contact.phone;
                    emailInput.value = contact.email || '';
                    
                    // 更新UI状态
                    isEditing = true;
                    currentEditId = id;
                    formTitle.textContent = '编辑联系人';
                    submitBtn.textContent = '更新联系人';
                    cancelBtn.style.display = 'inline-block';
                }
            }
        })
        .catch(error => {
            showError('获取联系人详情失败: ' + error.message);
        });
}

// 更新联系人
async function updateContact(id, contactData) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
        throw new Error(result.message);
    }
}

// 删除联系人
async function deleteContact(id) {
    if (!confirm('确定要删除这个联系人吗？')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 重新加载列表
            loadContacts();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showError('删除联系人失败: ' + error.message);
    }
}

// 取消编辑
function cancelEdit() {
    resetForm();
}

// 重置表单
function resetForm() {
    contactForm.reset();
    isEditing = false;
    currentEditId = null;
    formTitle.textContent = '添加新联系人';
    submitBtn.textContent = '添加联系人';
    cancelBtn.style.display = 'none';
}

// 工具函数
function showLoading() {
    loading.style.display = 'block';
    contactsTable.style.display = 'none';
    emptyMessage.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}