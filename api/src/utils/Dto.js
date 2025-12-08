class DTO {
	userDto(user) {
		return {
			_id: user._id,
			name: user.name,
			fatherName: user.fatherName,
			email: user.email,
			role: user.role,
			employeeCode: user.employeeCode || null,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	employeeDto(employeeProfile, user) {
		return {
			id: employeeProfile._id?.toString() || user?._id?.toString(),
            userId: user?._id?.toString(),
			_id: employeeProfile._id?.toString() || user?._id?.toString(),
			name: user?.name || "",
			fatherName: user?.fatherName || "",
			email: user?.email || "",
			role: employeeProfile?.roleTitle || "",
			department: employeeProfile?.department?.name || employeeProfile?.department || "",
			departmentId: employeeProfile?.department?._id?.toString() || employeeProfile?.department?.toString() || null,
			salary: employeeProfile?.salary || 0,
			status: employeeProfile?.status || "active",
			joinDate: employeeProfile?.joinDate ? new Date(employeeProfile.joinDate).toISOString().split("T")[0] : "",
			avatar: employeeProfile?.avatar || null,
			employeeCode: user?.employeeCode || null,
			createdAt: employeeProfile?.createdAt || user?.createdAt,
			updatedAt: employeeProfile?.updatedAt || user?.updatedAt,
		};
	}
}

export const dto = new DTO();